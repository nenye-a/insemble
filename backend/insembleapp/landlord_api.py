from rest_framework import status, generics, permissions
from .tenant_api import AsynchronousAPI, FastLocationDetailsAPI
from rest_framework.response import Response
from .landlord_serializers import PropertyTenantSerializer, PropertyDetailsSerializer, TenantDetailsSerializer
from bson import ObjectId
import data.api.goog as google
import data.utils as utils
import data.landlord_matching as landlord_matching
import data.landlord_provider as landlord_provider
import data.provider as provider
from .celery import app as celery_app


'''

This file contains the landlord api interface for the matching algorithm.
The endpoints to access this interface is presented in the "urls.py"
file.

'''


# TODO: implement api functions for the landlord api
# PropertyTenantApi - referenced by api/propertyTenants/
class PropertyTenantAPI(AsynchronousAPI):

    """

    This api endpoint will be used to populate the brands that a landlord sees for a specific space within a property.
    If the property already exists, a property_id must be provided to associate the space with the property. Otherwise,
    a new property will be generated.

    Brands will contain a list of matching brands. These brands are organize as the following. 

    - (Claimed or Verified) Brands interested in the landlords property.           -> (details known, and interest indicated)
    - (Claimed or Verified) Brands on the platform, but not interested.            -> (details known, but interest not indicated)
    - (Claimed or Verified) Brands not present on the platform.                    -> (details unknown, but can be approximated)

    These different stages will serve as tiers, and each tier will be ranked by match to the landlord's location and property. 
    Only verified brands are shown to the landlord. A "Claimed" brand is a brand that a tenant-side user has indicated ownership
    of, or that the Insemble team has pre-populated with user information. "Verified" brands are brands with ownership that has
    been verified by the Insemble team. Verified brands do not have to be claimed. Tenant side users can claim verified brands
    when they register for an account.

    parameters: {
        # Property related fields
        property_id: string                 (required -> not required if address and property type are added)       
        address: string,                    (required -> not required if property_id is provided)
        property_type: list[string],        (required -> not required if property_id is provided)
        logo: string (url),                 (ignored if property_id provided)
        owning_organization: string,        (ignored if property_id provided)
        target_categories: list[string],    (ignored if property_id provided)
        exclusives: list[string],           (ignored if property_id provided)

        # Space related fields
        sqft: int,                          (required)
        tenant_type: list[string],          (required)
        space_condition: list[string],
        asking_rent: int,
        divisible: boolean,
        divisible_sqft: list[int],
        pro: boolean,
        visible: boolean,
        media: {                           # NOTE: might be removed due to redundancy
            photos: {
                main: url_string,
                other: list[url_string]
            },
            tour: url_string (matterport)
        }
    }

    response: {
        status: int (HTTP),                 (always provided)
        status_detail: string or list,      (always provided)
        property_id: string,                
        space_id: string,
        brands: [
            {
                brand_id: string,
                picture_url: url,
                name: string,
                category: string,
                num_existing_locations: int,
                match_value: int,
                interested: boolean,
                matches_tenant_type: boolean
            }
            ... many more
        ]
    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = PropertyTenantSerializer

    def get(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        # STORE THE PROPERTY & SPACE DETAILS
        space_id = ObjectId()
        space = {
            'space_id': space_id,
            'space_condition': validated_params['space_condition'] if 'space_condition' in validated_params else [],
            'tenant_type': validated_params['tenant_type'] if 'tenant_type' in validated_params else [],
            'asking_rent': validated_params['asking_rent'] if 'asking_rent' in validated_params else None,
            'sqft': validated_params['sqft'],
            # unused details
            'divisible': validated_params['divisible'] if 'divisible' in validated_params else False,
            'divisible_sqft': validated_params['divisible_sqft'] if 'divisible_sqft' in validated_params else [],
            'pro': validated_params['pro'] if 'pro' in validated_params else False,
            'visible': validated_params['visible'] if 'visible' in validated_params else False,
            'media': {}  # redundant with front-end, might need to be removed.
        }

        # TODO: currently user is not inserted as this is hosted on the postgres side. Need to evaluate if there's a need
        # to pull into the mongodb database.
        if 'property_id' in validated_params:
            this_property = landlord_provider.get_property(validated_params['property_id'])
            if not this_property:
                # if the property does not exist, return no content response
                return Response({
                    'status': status.HTTP_404_NOT_FOUND,
                    'status_detail': ["Could not find a property that matches that Id."],
                }, status=status.HTTP_404_NOT_FOUND)
            this_property['spaces'].append(space)
            # ignore all updates to the space if provided
            utils.DB_PROPERTY.update_one({'_id': this_property['_id']}, {'$set': this_property})
            property_id = this_property['_id']

        else:
            google_location = google.find(validated_params['address'], allow_non_establishments=True, save=False)
            property_lat = round(google_location["geometry"]["location"]["lat"], 6)
            property_lng = round(google_location["geometry"]["location"]["lng"], 6)

            formatted_address = google_location["formatted_address"] if "formatted_address" in google_location else google_location["vicinity"]
            already_exists = self.check_property_exists(formatted_address)
            if already_exists:
                return Response({
                    'status': status.HTTP_409_CONFLICT,
                    'status_detail': ["This property already exists. Please resubmit with a property_id to update."],
                }, status=status.HTTP_409_CONFLICT)

            # TODO: check if we already have an address here
            this_property = {
                'address': formatted_address,
                'location': {
                    'type': "Point",
                    'coordinates': [
                        property_lng,
                        property_lat
                    ]
                },
                # NOTE: logo, and owning_organization unimplemented, null for now
                'logo': validated_params['logo'] if 'logo' in validated_params else None,
                'owning_organization': validated_params['logo'] if 'logo' in validated_params else None,
                'property_type': validated_params['property_type'] if 'property_type' in validated_params else [],
                'target_tenant_categories': validated_params['tenant_categories'] if 'tenant_categories' in validated_params else [],
                'exclusives': validated_params['exclusives'] if 'exclusives' in validated_params else [],
                'spaces': [space]
            }

            # grab the nearby stores asynchronously
            n_process, nearby = self.get_nearby_places.delay(property_lat, property_lng), []
            nearby_listener = self._celery_listener(n_process, nearby)
            nearby_listener.start()

            location = landlord_provider.build_location(property_lat, property_lng)
            _, nearby = nearby_listener.join(), nearby[0]

            location.update(nearby)
            if '_id' in location:
                utils.DB_LOCATIONS.update({"_id": location['_id']}, location)
                this_property['location_id'] = location['_id']
            else:
                this_property['location_id'] = utils.DB_LOCATIONS.insert(location)
            property_id = utils.DB_PROPERTY.insert(this_property)

        # Should do this in an other class that is made for updating and refetching
        # the matches for a space. Then this is just an automatic call.
        brands = landlord_provider.get_matching_tenants_new(this_property, space_id)

        return Response({
            'status': status.HTTP_200_OK,
            'property_id': str(property_id),
            'space_id': str(space_id),
            'brands': brands,
        }, status=status.HTTP_200_OK)

    def check_property_exists(self, address):
        existing_property = utils.DB_PROPERTY.find_one({'address': address}, {'_id': 1})
        # return the id if it exists, else None
        return existing_property['_id'] if existing_property else False

    @staticmethod
    @celery_app.task
    def generate_matches(address):
        return landlord_provider.get_matching_tenants(address)

    @staticmethod
    @celery_app.task
    def get_spatial_personas(lat, lng):
        return provider.get_spatial_personas(lat, lng)

    @staticmethod
    @celery_app.task
    def get_environics_demographics(lat, lng):
        return provider.get_environics_demographics(lat, lng)

    @staticmethod
    @celery_app.task
    def get_nearby_places(lat, lng):
        return provider.get_nearby_places(lat, lng)

    def _register_tasks(self) -> None:
        celery_app.register_task(self.generate_matches)
        celery_app.register_task(self.get_spatial_personas)
        celery_app.register_task(self.get_environics_demographics)
        celery_app.register_task(self.get_nearby_places)


# PropertyDetailsAPI - api/propertyDetails/
class PropertyDetailsAPI(AsynchronousAPI):

    serializer_class = PropertyDetailsSerializer

    def get(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        property_id = validated_params['property_id']
        place = landlord_provider.property_details(property_id)

        if not place:
            return Response({
                'status': 200,
                'status_detail': 'Successful Call, but No Details Found',
                'result': {}
            })

        demographics = FastLocationDetailsAPI.obtain_demographics(place)
        personas = provider.fill_personas(place["psycho1"])

        try:
            commute = demographics["1mile"].pop("commute")
            demographics["3mile"].pop("commute")
            demographics["5mile"].pop("commute")
        except Exception:
            commute = None

        response = {
            'status': 200,
            'status_detail': 'Success',
            'result': {
                'key_facts': place['key_facts'],
                'commute': commute,
                'personas': personas,
                'demographics1': demographics["1mile"],
                'demographics3': demographics["3mile"],
                'demographics5': demographics["5mile"]
            }
        }

        return Response(response, status=status.HTTP_200_OK)


# TenantDetailsAPI - api/tenantDetails/
class TenantDetailsAPI(AsynchronousAPI):
    """

    params: {
        tenant_id: string
    }

    """

    serializer_class = TenantDetailsSerializer

    def get(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        tenant_id = validated_params['tenant_id']
        place = landlord_provider.tenant_details(tenant_id)

        if not place:
            return Response({
                'status': 200,
                'status_detail': 'Successful Call, but No Details Found',
                'result': {}
            })

        demographics = FastLocationDetailsAPI.obtain_demographics(place)
        personas = provider.fill_personas({
            key: value for key, value in list(place["psycho1"].items())[:3]
        })

        # TODO: algorithmically generate overview and requirement details:
        overview = "Actively looking for a space in the Greater Los Angeles Area"
        description = place["name"] + " is an awesome new restailer/restaurant in town"
        physical_requirements = {
            'minimum sqft': 4000,
            'frontage width': 40,
            'condition': "White Box"
        }

        key_facts = {
            'num_stores': 10,
            'years_operating': 7,
            'rating': place["rating"] if 'rating' in place else 4.3,
            'num_reviews': place["user_ratings_total"] if 'user_ratings_total' in place else 203
        }

        response = {
            'status': 200,
            'status_detail': 'Success',
            'result': {
                'key_facts': key_facts,
                'tenant': {
                    'overview': overview,
                    'description': description,
                    'physical requirements': physical_requirements
                },
                'insights': {
                    'personas': personas,
                    'demographics1': demographics["1mile"],
                    'demographics2': demographics["3mile"],
                    'demographics3': demographics["5mile"],
                }
            }
        }

        return Response(response, status=status.HTTP_200_OK)


class UpdateSpaceBrandsAPI(AsynchronousAPI):
    """

    This endpoint will return an updated list of brands for a particular space.

    parameters: {
        property_id: string,                (required)
        space_id: string,                   (required)
    }

    response: {
    }


    """

    pass
