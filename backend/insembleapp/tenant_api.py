import json
import time
import threading
import data.matching as matching
import data.provider as provider
from rest_framework import status, generics, permissions, serializers
from rest_framework.response import Response
from .tenant_serializers import TenantMatchSerializer, LocationDetailSerializer
from .celery import app as celery_app


'''

This file contains the main api interface for the matching algorithm.
The endpoints to access this interface is presented in the "urls.py"
file.

'''


# FilterDetailApi - referenced by api/filter/
class FilterDetailAPI(generics.GenericAPIView):
    """

    API holder for receiving all the filter information.

    parameters: {}

    response: {
        status: int,                                (always provided)
        status_detail: string or list[string],      (always provided)
        brand_categories: list[string],             (always provided)
        personas: list[string],                     (always provided)
        education: list[string],                    (always provided)
        commute: list[string],                      (always provided)
        type: list[string]
    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = serializers.Serializer()

    def get(self, request, *args, **kwargs):

        response = {
            'status': 200,
            'status_detail': "Success",
            'brand_categories': matching.FOURSQUARE_CATEGORIES,
            'personas': matching.SPATIAL_CATEGORIES,
            'education': matching.EDUCATION_LIST,
            'commute': matching.TRANSPORT_LIST,
            'type': ["Retail", "Restaurant"]
        }
        return Response(response, status=status.HTTP_200_OK)

# TenantMatchApi - referenced by api/tenantMatch/


class TenantMatchAPI(generics.GenericAPIView):

    """

    Provided parameters describing a retail location, this endpoint will return the best matching locations within
    the los angeles region.

    parameters: {
        address: string,            (required -> not required if categories are provided)
        brand_name: string,         (required -> not required if categories are provided)
        categories: list[string],   (required -> not required if brand_name and address provided)
        income: {                   (required -> not required if brand_name and address provided)
            min: int,               (required if income provided)
            max: int                (optional)
        },
        age: {
            min: int,               (optional)
            max: int                (optional)
        },
        personas: list[string],     (optional)
        commute: list[string],      (optional)
        education: list[string],    (optional)
        rent: {                     (optional)
            min: int,               (required if rent provided)
            max: int                (optional)
        }
    }

    response: {
        status: int (HTTP),                 (always provided)
        status_detail: string or list,      (always provided)
        matching_locations: [               (not provided if error occurs)
            {                               (all fields provided if matching locations provided)
                lat: float,
                lng: float,
                match_score: float,
            },
            {
                ... (same as above)
            }
        ],
        matching_properties: [              (not provided if error occurs) - may be empty
            {                               (all fields provided if matching properties provided)
                'address': string,
                'rent':  int,
                'sqft': int,
                'type': string,
            }
        ]
    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TenantMatchSerializer

    def get(self, request, *args, **kwargs):
        # validate the input parameters
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        # Execute match generation based on the parameters provided,
        if 'address' in validated_params:
            matches = matching.generate_matches(
                validated_params['address'], name=validated_params['brand_name']
            )
        else:
            # TODO: implement case that relies only on categories & income
            # in the mean time, will return the matches from a default location
            matches = matching.generate_matches(
                "371 E 2nd Street, LA, CA"
            )

        # ensure that the response is an object. May not be necessary
        matches = json.loads(matches)
        response = {
            'status': status.HTTP_200_OK,
            'status_detail': "Success",
            'matching_locations': matches,
            'matching_properties': []  # TODO: implement determination of matching properties
        }

        return Response(response, status=status.HTTP_200_OK)
        # TODO: utilize the other parameters in the matching algorithms


# LocationDetailsApi - referenced by api/locationDetails/
class LocationDetailsAPI(generics.GenericAPIView):

    """

    Provided two locations to compare, this api will generate the match details between each.

    parameters: {
        my_location: {                          (required)
            address: string,                    (required -> not required if categories are provided)
            brand_name: string,                 (required -> not required if categories are provided)
            categories: list[string],           (required)
            income: {                           (required -> not required if brand_name and address provided)
                min: int,                       (required if income provided)
                max: int,
            }
        },
        target_location: {                      (required, not used if property_id is provided)
            lat: int,
            lng: int,
        },
        property_id: string,                    (optional)
    }

    response: {
        status: int (HTTP),                     (always provided)
        status_detail: string,                  (always provided)
        result: {                               (not provided if error occurs)
            match_value: float,
            affinities: {
                growth: boolean,
                personas: boolean,
                demographics: boolean,
                ecosystem: boolean,
            },
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
                    name: string,
                    description: string,
                    tag: string
                },
                { ... same as above },
                { ... same as above }
            ],
            demographics: {
                age: {
                    <18: {
                        my_location: float,                                 (only provided if address is provided)
                        target_location: float,
                        growth: float
                    },
                    18-24: { ... same as above },
                    25-34: { ... same as above },
                    35-54: { ... same as above },
                    45-54: { ... same as above },
                    55-64: { ... same as above },
                    65+ : {... same as above}
                    }
                },
                income: {
                    <$50K: {
                        my_location: float,                                 (only provided if address is provided)
                        target_location: float,
                        growth: float
                    },
                    $50K-$74K: { ... same as above },
                    $75K-$124K: { ... same as above },
                    $125K-$199K: { ... same as above },
                    $200K: { ... same as above}
                },
                ethnicity: {
                    white: {
                        my_location: float,                                 (only provided if address is provided)
                        target_location: float,
                        growth: float
                    },
                    black: { ... same as above },
                    indian: { ... same as above },
                    asian: { ... same as above},
                    pacific_islander: { ... same as above },
                    other: { ... same as above }
                },
                education: {
                    some_highschool: {
                        my_location: float,                                 (only provided if address is provided)
                        target_location: float,
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
                        my_location: float,                                 (only provided if address is provided)
                        target_location: float,
                        growth: float
                    },
                    female: { ... same as above }
                }
            },
            nearby : [
                {
                    lat: float,
                    lng: float,
                    name: string,
                    rating: float,                                          (only provided if available)
                    number_rating: float,                                   (only provided if available)
                    category: string,                                       (may be null)
                    distance: float,
                    restaurant: boolean,                                    (only provided if True)
                    retail: boolean,                                        (only provided if True)
                    similar: boolean
                },
                ... many more
            ],
        }
    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = LocationDetailSerializer

    def get(self, request, *args, **kwargs):

        # register all celery tasks
        self._register_tasks()

        # ensure that the data is received correctly
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        # TODO: KO acquisition of details for my location
        if 'address' in validated_params['my_location']:

            # my_location = [self._get_location_details(validated_params['my_location'])]
            # get location match details asynchronously
            l_process, my_location = self._get_location_details.delay(validated_params['my_location']), []
            my_location_listener = self._celery_listener(l_process, my_location)
            my_location_listener.start()
        else:
            # TODO: get the information for the categories
            pass

        # KO data request for target location. If target location is an existing
        # property, we will provide the details here.
        if 'property_id' in validated_params:
            # TODO: get all the infromation from property database
            pass
        else:
            # TODO: get all the information from the latitude & longitude
            lat = validated_params['target_location']['lat']
            lng = validated_params['target_location']['lng']

            # target_location = [self._get_location_details(validated_params["target_location"], False)]
            # get location match details asynchronously
            l_process, target_location = self._get_location_details.delay(validated_params["target_location"], False), []
            target_location_listener = self._celery_listener(l_process, target_location)
            target_location_listener.start()

            # obtain key facts asynchronously
            kf_process, key_facts = self._get_key_facts.delay(lat, lng), []
            key_facts_listener = self._celery_listener(kf_process, key_facts)
            key_facts_listener.start()

            # obtain the demographic details asynchronously
            d_process, target_demo1 = self._get_demographics.delay(lat, lng, 1), []
            target_demo1_listener = self._celery_listener(d_process, target_demo1)
            target_demo1_listener.start()

            # obtain the nearby details asynchronously
            # n_process, target_nearby = self._get_nearby.delay(lat, lng, validated_params['my_location']['categories']), []
            n_process, target_nearby = self._get_nearby.delay(lat, lng, validated_params['my_location']['categories']), []
            target_nearby_listener = self._celery_listener(n_process, target_nearby)
            target_nearby_listener.start()

        # TODO: get top personas (factor in the cases of both the property id and the regular params)

        key_facts_listener.join()  # need to account for non definition of the listeners
        target_demo1_listener.join()  # need to acount for non declaration of the listener
        target_nearby_listener.join()
        my_location_listener.join()
        target_location_listener.join()

        # TODO: process demographics

        response = {
            'status': 200,
            'status_detail': 'Success',
            'key_facts': key_facts[0],
            # 'demo': target_demo1[0],
            'target_nearby': target_nearby[0],
            'my_location': my_location[0]['HouseholdGrowth2017-2022-1'],
            'target_location': target_location[0]['HouseholdGrowth2017-2022-1']
        }

        return Response(response, status=status.HTTP_200_OK)

    # Takes a celery process and returns a threading task that will update
    # result pool with the final items when the process completes.
    # celery_process: celery task item that tracks celery progress
    # result_pool: mutable list that will contain the item results when done
    def _celery_listener(self, celery_process, result_pool):

        def listen(process, dump):
            while not process.ready():
                # wait a fraction of a second prior to checking again
                time.sleep(0.1)
            dump.append(process.get(timeout=1))

        return threading.Thread(target=listen, args=(celery_process, result_pool,))

    # location assumed to be the same structure as "my_location", and target_location assumed to be the
    # same structure as "target_location"
    @staticmethod
    @celery_app.task
    def _get_match_details(location, target_location):

        # TODO: get the match details for two locations
        pass

    # location expected to either have address & brand_name, otherwise it's assumed to have a latitude
    # longitude pair
    @staticmethod
    @celery_app.task
    def _get_location_details(location, has_address_and_brand_name=True):
        if has_address_and_brand_name:
            return dict(matching.generate_vector_address(location["address"], location["brand_name"]).iloc[0])
        else:
            return dict(matching.generate_vector_location(location["lat"], location["lng"]).iloc[0])

    @staticmethod
    @celery_app.task
    def _get_key_facts(lat, lng):
        return provider.get_key_facts(lat, lng)

    @staticmethod
    @celery_app.task
    def _get_personas(lat, lng):
        # TODO: get the paersonas
        pass

    @staticmethod
    @celery_app.task
    def _get_demographics(lat, lng, radius):
        return provider.get_demographics(lat, lng, radius)

    @staticmethod
    @celery_app.task
    def _get_nearby(lat, lng, categories):
        return provider.get_nearby(lat, lng, categories)

    def _register_tasks(self) -> None:
        celery_app.register_task(self._get_nearby)
        celery_app.register_task(self._get_demographics)
        celery_app.register_task(self._get_match_details)
        celery_app.register_task(self._get_location_details)
        celery_app.register_task(self._get_personas)
        celery_app.register_task(self._get_key_facts)
