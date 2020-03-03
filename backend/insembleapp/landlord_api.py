from rest_framework import status, generics, permissions
from .tenant_api import AsynchronousAPI, FastLocationDetailsAPI
from rest_framework.response import Response
from .landlord_serializers import PropertyTenantSerializer, PropertyDetailsSerializer, TenantDetailsSerializer
from bson import ObjectId
import data.api.goog as google
import data.landlord_matching as landlord_matching
import data.landlord_provider as landlord_provider
import data.provider as provider
from .celery import app as celery_app
import json


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
        property_id: string                 (required -> not required if address and property type are added)       
        address: string,                    (required -> not required if property_id is provided)
        property_type: list[string],        (required -> not required if property_id is provided)
        space_type: list[string],           (required)
        tenant_type: list[string],          
        sqft: int,
        asking_rent: int,
        target_categories: list[string],
        exclusives: list[string],
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
                verified: boolean,
                claimed: boolean,
                matches_tenant_type: boolean,
                exclusivity_risk: boolean
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

        # STORE THE SPACE DETAILS
        property_params = validated_params.copy()
        space_params = {}
        for item in ['space_type', 'sqft', 'asking_rent']:
            if item in validated_params:
                space_params[item] = property_params.pop(item)

        # KO TENANT MATCHING FOR THE SPACE:
        # TODO: do this asynchronously and actually obtain real data. (should take in space_params)

        address = landlord_provider.property_address(
            validated_params['property_id']) if 'property_id' in validated_params else validated_params['address']
        m_process, match_details = self.generate_matches.delay(address), []
        match_listener = self._celery_listener(m_process, match_details)
        match_listener.start()

        # GENERATE_PROPERTY_LOCATION_DETAILS
        if 'property_id' not in validated_params:
            # if not property, generate the property details fresh.
            google_location = google.find(validated_params['address'], allow_non_establishments=True, save=False)
            location = google_location['geometry']['location']
            lat = location['lat']
            lng = location['lng']

            location_details = provider.get_location_details(location)
            if not (location_details and 'demo1' in location_details and 'psycho1' in location_details and 'nearby_complete' in location_details):

                # grab the 1 and 3 mile arcgis data
                arcgis_details1 = provider.get_formatted_arcgisdetails(lat, lng, 1)
                arcgis_details3 = provider.get_formatted_arcgisdetails(lat, lng, 3)

                # grab the nearby locations
                n_process, nearby = self.get_nearby_places.delay(lat, lng), []
                nearby_listener = self._celery_listener(n_process, nearby)
                nearby_listener.start()

                # obtain the 1, 3 mile demographic details asynchronously
                d_process, demo = self.get_environics_demographics.delay(lat, lng), []
                demo_listener = self._celery_listener(d_process, demo)
                demo_listener.start()

                # grab the 1, 3 mile psychographic deatils asynchronously
                p_process, psycho = self.get_spatial_personas.delay(lat, lng), []
                psycho_listener = self._celery_listener(p_process, psycho)
                psycho_listener.start()

                location["arcgis_details1"] = arcgis_details1

                # Obtain the keyfacts
                key_facts_demo = FastLocationDetailsAPI.obtain_key_demographics("", location)
                key_facts_nearby = FastLocationDetailsAPI.obtain_key_nearby("", google_location, key_facts_demo['mile'])
                key_facts_demo.update({
                    "num_metro": len(key_facts_nearby["nearby_metro"]),
                    "num_universities": len(key_facts_nearby["nearby_university"]),
                    "num_hospitals": len(key_facts_nearby["nearby_hospitals"]),
                    "num_apartments": len(key_facts_nearby["nearby_apartments"])
                })
                key_facts = key_facts_demo
                location["nearby_metro"] = key_facts_nearby["nearby_metro"]

                _, nearby = nearby_listener.join(), nearby[0]
                _, demo = demo_listener.join(), demo[0]
                _, psycho = psycho_listener.join(), psycho[0]

                location_details['arcgis_details1'] = arcgis_details1
                location_details['arcgis_details3'] = arcgis_details3

                location_details.update(nearby)
                location_details.update(demo)
                location_details.update(psycho)
                location_details["key_facts"] = key_facts
            else:
                location["arcgis_details1"] = provider.get_formatted_arcgisdetails(lat, lng, 1)
                key_facts_demo = FastLocationDetailsAPI.obtain_key_demographics("", location)
                key_facts_nearby = FastLocationDetailsAPI.obtain_key_nearby("", google_location, key_facts_demo['mile'])

                key_facts_demo.update({
                    "num_metro": len(key_facts_nearby["nearby_metro"]),
                    "num_universities": len(key_facts_nearby["nearby_university"]),
                    "num_hospitals": len(key_facts_nearby["nearby_hospitals"]),
                    "num_apartments": len(key_facts_nearby["nearby_apartments"])
                })

                key_facts = key_facts_demo
                location["nearby_metro"] = key_facts_nearby["nearby_metro"]
                location_details["key_facts"] = key_facts

                for item in ['name', 'rating', 'user_ratings_total', 'reviews', 'international_phone_number',
                             'foursquare_categories', 'formatted_address', 'detailed', 'types', 'reference',
                             'price_level', 'plus_code', 'place_id', 'photos', 'icon', '_id', 'formatted_phone_number',
                             'url', 'opening_hours']:
                    if item in location_details:
                        location_details.pop(item)

            property_params['location_details'] = location_details

        match_listener.join()
        space_params['brands'] = match_details[0]

        property_id = None
        if 'property_id' not in validated_params:
            # TODO: store the location details in the database and generate_id
            property_id, space_id = landlord_provider.add_property(property_params, space_params)
        else:
            space_id = landlord_provider.update_property_with_id(validated_params['property_id'], space_params)

        response = {
            'status': status.HTTP_200_OK,
            'status_detail': "Success",
            'property_id': property_id if property_id else validated_params['property_id'],
            'space_id': space_id,
            'brands': space_params['brands']
        }

        return Response(response, status=status.HTTP_200_OK)

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
