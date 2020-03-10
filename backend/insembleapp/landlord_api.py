from rest_framework import generics, status, permissions, serializers
from .tenant_api import AsynchronousAPI, FastLocationDetailsAPI
from rest_framework.response import Response
from .landlord_serializers import PropertyTenantSerializer, PropertyDetailsSerializer, TenantDetailsSerializer, PropertyCheckSerializer
from bson import ObjectId
import data.api.google as google
import data.utils as utils
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
                onPlatform: boolean,
                match_value: int,
                interested: boolean,
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

            # Check for address temporarily removed. In the future, we will do this earlier and then
            # ask the user to confirm if they indeed want to use this address even though it exists.

            # already_exists = self.check_property_exists(formatted_address)
            # if already_exists:
            #     return Response({
            #         'status': status.HTTP_409_CONFLICT,
            #         'status_detail': ["This property already exists. Please resubmit with a property_id to update."],
            #     }, status=status.HTTP_409_CONFLICT)

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
        brands = landlord_provider.get_matching_tenants(this_property, space_id)

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
    def get_nearby_places(lat, lng):
        return provider.get_nearby_places(lat, lng)

    def _register_tasks(self) -> None:
        celery_app.register_task(self.get_nearby_places)


class PropertyAddressCheck(generics.GenericAPIView):
    """
    API function that will check if an address is already registered as a property.
    """

    authentication_classes = []
    serializer_class = PropertyCheckSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def get(self, request, *args, **kwargs):

        address = kwargs.get("address", "")

        # format address using google
        google_location = google.find(address, allow_non_establishments=True, save=False)
        address = google_location["formatted_address"] if google_location else ""

        # search for the address in the database
        existing_property = utils.DB_PROPERTY.find_one({'address': address}, {'_id': 1})
        property_id = existing_property['_id'] if existing_property else False

        return Response({
            'status': 200,
            'status_detail': ["Success"],
            "result": {
                'exists': True if property_id else False,
                'property_id': str(property_id) if property_id else None
            }
        })


# PropertyDetailsAPI - api/propertyDetails/
class PropertyDetailsAPI(AsynchronousAPI):

    """
    Provided with the property_id, will return all the details needed to run the matches.

    params" {
        property_id: string
    }

    response: {
        status: int (HTTP),                     (always provided)
        status_detail: string or list,          (always provided)
        result: {    
            key_facts: {
                mile: int
                DaytimePop: float,
                MediumHouseholdIncome: float,
                TotalHousholds: float,
                HouseholdGrowth2017-2022: float,
                num_metro: int,                       (will never exceed 60)
                num_universities: int,                (will never exceed 60)
                num_hospitals: int,                   (will never exceed 60)
                num_apartments: int                   (will never exceed 60)
            },
            commute: {
                Public Transport: int,
                Bicycle: int,
                Carpooled: int,
                Drove Alone: int,
                Walked: int,
                Worked at Home: int
            },
            top_personas: [
                {
                    percentile: float,
                    photo: url,
                    name: string,
                    description: string,
                    tags: List[string]
                },
                { ... same as above },
                { ... same as above }
            ],
            demographics1: {
                age: {
                    <18: {
                        value: float
                        growth: float
                    },
                    18-24: { ... same as above },
                    25-34: { ... same as above },
                    35-54: { ... same as above },
                    45-54: { ... same as above },
                    55-64: { ... same as above },
                    65+ : { ... same as above}
                    }
                },
                income: {
                    <$50K: {
                        value: float
                        growth: float
                    },
                    $50K-$74K: { ... same as above },
                    $75K-$124K: { ... same as above },
                    $125K-$199K: { ... same as above },
                    $200K: { ... same as above}
                },
                ethnicity: {                                                (no subcategory will contain growth)
                    white: {
                        value: float
                        growth: float
                    },
                    black: { ... same as above },
                    indian: { ... same as above },
                    asian: { ... same as above},
                    pacific_islander: { ... same as above },
                    other: { ... same as above }
                },
                education: {                                                (no subcategory will contain growth)
                    some_highschool: {
                        value: float
                        growth: float
                    },
                    highschool: { ... same as above },
                    some_college: { ... same as above },
                    associate: { ... same as above },
                    bachelor: { ... same as above },
                    masters: { ... same as above },
                    professional: { ... same as above },
                    doctorate: { ... same as above }
                },
                gender: {
                    male: {
                        value: float
                        growth: float
                    },
                    female: { ... same as above }
                }
            },
            demographics3: ... same as demographics,
            demographics5: ... same as demographics,
        }
    }

    """

    serializer_class = PropertyDetailsSerializer

    def get(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        property_id = validated_params['property_id']
        this_property = utils.DB_PROPERTY.find_one({'_id': ObjectId(property_id)}, {'location_id'})

        if not this_property:
            return Response({
                'status': status.HTTP_404_NOT_FOUND,
                'status_detail': ['This property was not found, please make sure to check the id.']
            }, status=status.HTTP_404_NOT_FOUND)

        location_id = this_property['location_id']
        location = utils.DB_LOCATIONS.find_one({'_id': location_id})
        property_lat = location['location']['coordinates'][1]
        property_lng = location['location']['coordinates'][0]

        personas = provider.fill_personas(location['spatial_psychographics']["1mile"])
        demographics = self.convert_demographics(location['environics_demographics'])

        try:
            commute = demographics["1mile"].pop("commute") if 'commute' in demographics["1mile"] else None
            demographics["3mile"].pop("commute") if 'commute' in demographics["1mile"] else None
            demographics["5mile"].pop("commute") if 'commute' in demographics["1mile"] else None
        except Exception:
            commute = None

        key_facts = location['arcgis_demographics']['1mile'] or {}
        if key_facts != {}:
            key_facts.pop('DaytimeWorkingPop')
            key_facts.pop('DaytimeResidentPop')

        key_facts['num_metro'] = len(location['nearby_subway_station'] if 'neaby_subway_station' in location else google.nearby(
            property_lat, property_lng, 'subway_station', radius=1))
        key_facts['num_universities'] = len(location['nearby_university'] if 'nearby_university' in location else google.nearby(
            property_lat, property_lng, 'university', radius=1))
        key_facts['num_hospitals'] = len(location['nearby_hospitals'] if 'nearby_hospitals' in location else google.nearby(
            property_lat, property_lng, 'hospital', radius=1))
        key_facts['nearby_apartments'] = len(location['nearby_apartments'] if 'nearby_apartments' in location else google.search(
            property_lat, property_lng, 'apartments', radius=1))

        response = {
            'status': 200,
            'status_detail': 'Success',
            'result': {
                'key_facts': key_facts,
                'commute': commute,
                'personas': personas,
                'demographics1': demographics["1mile"],
                'demographics3': demographics["3mile"],
                'demographics5': demographics["5mile"]
            }
        }

        return Response(response, status=status.HTTP_200_OK)

    def convert_demographics(self, demographic_dict):
        return {
            '1mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['1mile']),
            '3mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['3mile']),
            '5mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['5mile'])
        }


# TenantDetailsAPI - api/tenantDetails/
class TenantDetailsAPI(AsynchronousAPI):
    """

    Provided both the tenant_id and the property_id, will return the deep dive details.

    params: {
        tenant_id: string,
        property_id: string
    }

    response: {

    }

    """

    serializer_class = TenantDetailsSerializer

    def get(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        tenant_id = validated_params['tenant_id']
        property_id = validated_params['property_id']

        brand = utils.DB_BRANDS.find_one({'_id': ObjectId(tenant_id)})
        this_property = utils.DB_PROPERTY.find_one({'_id': ObjectId(property_id)}, {'location_id': 1})

        if not brand:
            return Response({
                'status': status.HTTP_404_NOT_FOUND,
                'status_detail': ['Brand not found, please check the provided id'],
            }, status=status.HTTP_404_NOT_FOUND)
        if not this_property:
            return Response({
                'status': status.HTTP_404_NOT_FOUND,
                'status_detail': ['Property not found, please check the provided id'],
            }, status=status.HTTP_404_NOT_FOUND)

        property_location = utils.DB_LOCATIONS.find_one({'_id': this_property['location_id']})
        personas = provider.fill_personas(
            {
                key: value for key, value in sorted(
                    brand['average_spatial_psychographics']["1mile"].items(), key=lambda item: item[1], reverse=True)[:3]
            }
        )

        tenant_demographics = self.convert_demographics(brand['average_environics_demographics'])
        property_demographics = self.convert_demographics(property_location['environics_demographics'])
        field_names = ("tenant_location", "property_details")

        demographics = {}
        demographics["1mile"] = provider.combine_demographics(tenant_demographics["1mile"], property_demographics["1mile"], field_names)
        demographics["3mile"] = provider.combine_demographics(tenant_demographics["3mile"], property_demographics["3mile"], field_names)
        demographics["5mile"] = provider.combine_demographics(tenant_demographics["5mile"], property_demographics["5mile"], field_names)

        demographics["1mile"].pop("commute") if 'commute' in demographics["1mile"] else None
        demographics["3mile"].pop("commute") if 'commute' in demographics["3mile"] else None
        demographics["5mile"].pop("commute") if 'commute' in demographics["5mile"] else None

        # TODO: algorithmically generate overview and requirement details:
        overview = "Expanding in " + ", ".join(brand['regions_present']['regions']) if 'regions' in brand['regions_present'] else ""
        description = brand['description'] if brand['description'] else "No description provided."

        physical_requirements = {
            'minimum sqft': brand['typical_squarefoot'][0]['min'] if brand['typical_squarefoot'] and len(brand['typical_squarefoot']) > 0 else None,
            'frontage width': None,
            'condition': "",
            'property_type': brand['typical_property_type']['type'] if brand['typical_property_type'] and len(brand['typical_property_type']) > 0 else None
        }

        key_facts = {
            'num_stores': brand["number_found_locations"],
            'years_operating': None,
            'rating': brand["average_popularity"][0]['rating'] if len(brand['average_popularity']) > 0 else None,
            'num_reviews': brand["average_popularity"][0]['user_ratings_total'] if len(brand['average_popularity']) > 0 else None
        }

        response = {
            'status': 200,
            'status_detail': 'Success',
            'result': {
                'brand_name': brand['brand_name'],
                'category': brand['categories'][0]['categories'][0]['short_name'],
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

    def convert_demographics(self, demographic_dict):
        return {
            '1mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['1mile']),
            '3mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['3mile']),
            '5mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['5mile'])
        }


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
