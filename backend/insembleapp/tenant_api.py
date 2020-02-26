import json
import time
import timeit
import ast
import threading
import data.matching as matching
import data.provider as provider
import data.api.goog as google
import data.api.arcgis as arcgis
from bson import ObjectId
from rest_framework import status, generics, permissions, serializers
from rest_framework.response import Response
from .tenant_serializers import TenantMatchSerializer, LocationDetailSerializer, LocationSerializer, FastLocationDetailSerializer
from .celery import app as celery_app


'''

This file contains the main api interface for the matching algorithm.
The endpoints to access this interface is presented in the "urls.py"
file.

'''


class AsynchronousAPI(generics.GenericAPIView):
    """
    Can be inherited by any other views in order to enable asynchronous functions.
    """

    # allows all access by default, overload in child class.
    permission_classes = [
        permissions.AllowAny
    ]

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

    def _register_tasks(self) -> None:
        """
        Register any celery tasks defined.
        """
        # example call:
        # celery_app.register_task(self._get_nearby)
        pass


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
            'brand_categories': provider.get_category_list(),
            'personas': matching.SPATIAL_CATEGORIES,
            'education': matching.EDUCATION_LIST,
            'ethnicity': matching.RACE_LIST,
            'commute': matching.TRANSPORT_LIST,
            'type': ["Free standing, Shopping Center, Inline, Endcap, and Pedestrian"],
            'equipment': provider.EQUIPMENT_LIST
        }
        return Response(response, status=status.HTTP_200_OK)

# TenantMatchApi - referenced by api/tenantMatch/


class TenantMatchAPI(AsynchronousAPI):

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
        ethnicity: list[string],    (optional)
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
        ],
        tenant_id: string                   (always provided)
    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TenantMatchSerializer

    def get(self, request, *args, **kwargs):

        self._register_tasks()

        # validate the input parameters
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        # STORE THE REQUEST INFORMATION IN THE DATABASE
        database_update = {'search_details': validated_params}

        # ASYNCHRONOUSLY GENERATE MATCH DETAILS & OBTAIN OBJECT ID
        if 'address' in validated_params:
            address = validated_params['address']
            name = validated_params['brand_name']

            m_process, match_details = self.generate_matches.delay(address, name=name, options=validated_params), []
            match_listener = self._celery_listener(m_process, match_details)
            match_listener.start()

            # matches, tenant_id = matching.generate_matches(
            #     address, name=name
            # )

        else:
            print("Match categories", validated_params['categories'])
            # FIXME: change url parsing & parameters to better receive lists of information, current method is error prone
            categories = [string.strip() for string in ast.literal_eval(validated_params['categories'][0])]
            print(categories)
            location = provider.get_representative_location(categories, validated_params['income'])
            if location:
                address = location['address']
                name = location['name']

                m_process, match_details = self.generate_matches.delay(address, name=name, options=database_update), []
                match_listener = self._celery_listener(m_process, match_details)
                match_listener.start()
            else:
                match_listener = None
                match_details = [([], None)]
            #     matches, tenant_id = matching.generate_matches(
            #         address, name=name
            #     )
            # else:
            #     matches, tenant_id = [], None

        # TODO: GENERATE TENANT LOCATION DETAILS
        tenant_details, rep_id = self.build_location(address, brand_name=name)
        if rep_id:
            database_update['rep_location'] = tenant_details
            database_update['rep_id'] = rep_id
        elif tenant_details:

            lat = tenant_details['geometry']['location']['lat']
            lng = tenant_details['geometry']['location']['lng']

            # TODO: account for people that are outside our range of coverage (fail our calls)
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

            _, nearby = nearby_listener.join(), nearby[0]
            _, demo = demo_listener.join(), demo[0]
            _, psycho = psycho_listener.join(), psycho[0]

            tenant_details['arcgis_details1'] = arcgis_details1
            tenant_details['arcgis_details3'] = arcgis_details3

            tenant_details.update(nearby)
            tenant_details.update(demo)
            tenant_details.update(psycho)
        else:
            # no place found, return error.
            pass

        if match_listener:
            match_listener.join()

        match_details = match_details[0]
        matches, tenant_id = match_details

        database_update['tenant_details'] = tenant_details
        database_update['rep_id'] = ObjectId(rep_id)

        # UPDATE TENANT DATABASE AND RETURN RESULT
        provider.update_tenant_details(tenant_id, database_update)
        response = {
            'status': status.HTTP_200_OK,
            'status_detail': "Success",
            'tenant_id': tenant_id,
            'matching_locations': matches,
            'matching_properties': []  # TODO: implement determination of matching properties
        }
        return Response(response, status=status.HTTP_200_OK)
        # TODO: utilize the other parameters in the matching algorithms

    def build_location(self, address, brand_name=None):
        return provider.build_location(address, brand_name=brand_name)

    @staticmethod
    @celery_app.task
    def generate_matches(address, name, options):
        return matching.generate_matches(address, name=name, options=options)

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


# LocationDetailsApi - referenced by api/locationDetails/


class LocationDetailsAPI(AsynchronousAPI):

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
        status_detail: string or list,          (always provided)
        overview: {                               (not provided if error occurs)
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
                    tags: List[string]
                },
                { ... same as above },
                { ... same as above }
            ],
            demographics1: {
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
                    65+ : { ... same as above}
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
                ethnicity: {                                                (no subcategory will contain growth)
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
                education: {                                                (no subcategory will contain growth)
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
            demographics3: ... same as demographics,
            demographics5: ... same as demographics,
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
                    similar: boolean,
                    hospital: boolean,
                    apartment: boolean,
                    metro: boolean,
                },
                ... many more
            ],
        },
        property_details: {                                                 (only provided if property_details provided)
            3D_tour: url, (matterport media)                                (provided only when available)
            main_photo: url,
            sqft: int,
            photos: list[urls],
            summary: {
                price/sqft: int,
                type: string,
                condition: string
            },
            description: string
        }
    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = LocationDetailSerializer

    def get(self, request, *args, **kwargs):

        # indempotently register all celery tasks
        self._register_tasks()

        # validate request
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        if 'address' in validated_params['my_location']:

            # TODO: clean up the listener pattern (relatively repetative)

            # get location match details asynchronously
            l_process, my_location = self._get_location_details.delay(validated_params['my_location']), []
            my_location_listener = self._celery_listener(l_process, my_location)
            my_location_listener.start()

            location = provider.get_location(validated_params['my_location']['address'], validated_params['my_location']['brand_name'])
            my_lat = location['lat']
            my_lng = location['lng']

            # obtain the 1, 3, & 5 mile demographic details asynchronously
            d_process, my_demo1 = self._get_demographics.delay(my_lat, my_lng, 1), []
            my_demo1_listener = self._celery_listener(d_process, my_demo1)
            my_demo1_listener.start()

            d_process, my_demo3 = self._get_demographics.delay(my_lat, my_lng, 3), []
            my_demo3_listener = self._celery_listener(d_process, my_demo3)
            my_demo3_listener.start()

            d_process, my_demo5 = self._get_demographics.delay(my_lat, my_lng, 5), []
            my_demo5_listener = self._celery_listener(d_process, my_demo5)
            my_demo5_listener.start()

        else:

            categories = validated_params['my_location']['categories']
            income = validated_params['my_location']['income']
            print(categories)
            my_location = provider.get_representative_location(categories, income)
            # TODO: fix to still execute even if no categories are found
            if not my_location:
                return Response({
                    'status': 501,
                    'status_detail': ['Details for when no categories found unimplemented.']
                }, status=status.HTTP_501_NOT_IMPLEMENTED)

            l_process, my_location = self._get_location_details.delay(my_location, False), []
            my_location_listener = self._celery_listener(l_process, my_location)
            my_location_listener.start()

        # KO data request for target location. If target location is an existing
        # property, we will provide the details here.
        if 'property_id' in validated_params:
            # TODO: get all the infromation from property database (pending completion and organization of property databas)
            pass
        else:
            target_lat = validated_params['target_location']['lat']
            target_lng = validated_params['target_location']['lng']

            # get location match details asynchronously
            l_process, target_location = self._get_location_details.delay(validated_params["target_location"], False), []
            target_location_listener = self._celery_listener(l_process, target_location)
            target_location_listener.start()

            # obtain key facts asynchronously
            kf_process, key_facts = self._get_key_facts.delay(target_lat, target_lng), []
            key_facts_listener = self._celery_listener(kf_process, key_facts)
            key_facts_listener.start()

            # obtain the 1, 3, & 5 mile demographic details asynchronously
            d_process, target_demo1 = self._get_demographics.delay(target_lat, target_lng, 1), []
            target_demo1_listener = self._celery_listener(d_process, target_demo1)
            target_demo1_listener.start()

            d_process, target_demo3 = self._get_demographics.delay(target_lat, target_lng, 3), []
            target_demo3_listener = self._celery_listener(d_process, target_demo3)
            target_demo3_listener.start()

            d_process, target_demo5 = self._get_demographics.delay(target_lat, target_lng, 5), []
            target_demo5_listener = self._celery_listener(d_process, target_demo5)
            target_demo5_listener.start()

            # obtain the nearby details asynchronously
            n_process, target_nearby = self._get_nearby.delay(target_lat, target_lng, validated_params['my_location']['categories']), []
            target_nearby_listener = self._celery_listener(n_process, target_nearby)
            target_nearby_listener.start()

        my_location_listener.join()
        target_location_listener.join()

        # obtain the match values asynchronously
        m_process, match_values = self._get_match_value.delay(target_location[0], my_location[0]), []
        match_value_listener = self._celery_listener(m_process, match_values)
        match_value_listener.start()

        # obtain the top personas asynchronously - TODO: fix to not rely on categories
        p_process, top_personas = self._get_personas.delay(target_location[0], my_location[0]), []
        personas_nearby_listener = self._celery_listener(p_process, top_personas)
        personas_nearby_listener.start()

        target_demo1_listener.join()
        target_demo3_listener.join()
        target_demo5_listener.join()

        # remove commute from 1 and 5 mile (will use the 3 mile to fill)
        target_demo1[0].pop('commute')
        commute = target_demo3[0].pop('commute')
        target_demo5[0].pop('commute')

        # combine demographics if comparing against existing address.
        if 'address' in validated_params['my_location']:
            my_demo1_listener.join()
            my_demo3_listener.join()
            my_demo5_listener.join()

            my_demo1[0].pop('commute')
            my_demo3[0].pop('commute')
            my_demo5[0].pop('commute')

            demographics1 = provider.combine_demographics(my_demo1[0], target_demo1[0])
            demographics3 = provider.combine_demographics(my_demo3[0], target_demo3[0])
            demographics5 = provider.combine_demographics(my_demo5[0], target_demo5[0])
        else:
            demographics1 = target_demo1[0]
            demographics3 = target_demo3[0]
            demographics5 = target_demo5[0]

        key_facts_listener.join()
        target_nearby_listener.join()
        match_value_listener.join()
        personas_nearby_listener.join()

        response = {
            'status': 200,
            'status_detail': 'Success',
            'result': {
                'match_value': match_values[0]['match'],
                'affinities': match_values[0]['affinities'],
                'key_facts': key_facts[0],
                'commute': commute,
                'top_personas': top_personas[0],
                'demographics1': demographics1,
                'demographics3': demographics3,
                'demographics5': demographics5,
                'nearby': target_nearby[0]
            }
        }

        return Response(response, status=status.HTTP_200_OK)

    # location assumed to be the same structure as "my_location", and target_location assumed to be the
    # same structure as "target_location"
    @staticmethod
    @celery_app.task
    def _get_match_value(target_location, location):
        return provider.get_match_value(location, target_location)

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
        return provider.get_key_facts_deprecated(lat, lng)

    @staticmethod
    @celery_app.task
    def _get_personas(target, location):
        return provider.get_matching_personas(target, location)

    @staticmethod
    @celery_app.task
    def _get_demographics(lat, lng, radius, demographic_vector=None):
        return provider.get_demographics(lat, lng, radius, demographic_vector)

    @staticmethod
    @celery_app.task
    def _get_nearby(lat, lng, categories):
        return provider.get_nearby(lat, lng, categories)

    def _register_tasks(self) -> None:
        celery_app.register_task(self._get_nearby)
        celery_app.register_task(self._get_demographics)
        celery_app.register_task(self._get_match_value)
        celery_app.register_task(self._get_location_details)
        celery_app.register_task(self._get_personas)
        celery_app.register_task(self._get_key_facts)


# FastLocationDetailsAPI (modified) = referenced by api/fastLocationDetails (temporary, to replace the locationDetail API)
class FastLocationDetailsAPI(AsynchronousAPI):

    """

    Refer to LocationDetailsAPI for the definition. (Temporary)

    parameters: {
        tenant_id: string,                      (required)
        target_location: {                      (required, not used if property_id is provided)
            lat: int,
            lng: int,
        },
        property_id: string                     (optional)
    }


    """

    serializer_class = FastLocationDetailSerializer

    def get(self, request, *args, **kwargs):

        self._register_tasks()
        # TODO: us tenant_id to grab the matches from the database.

        # validate request
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        # GET THE TENANT DETAILS
        tenant = provider.get_tenant_details(validated_params["tenant_id"])

        # GET THE LOCATION OR PROPERTY DETAILS
        if 'property_id' in validated_params:
            location = provider.get_property(validated_params["property_id"])
        else:
            print(validated_params)
            location = provider.get_location_details(validated_params["target_location"])

            if not location:
                # get_all_the_details anyway
                # kick off our super slow function - ()
                pass

        # GET THE MATCH VALUE
        match_value = provider.get_match_value_from_id(validated_params["tenant_id"], location['vector_id'])

        # stringify the objectIds
        tenant["_id"] = str(tenant["_id"]) if '_id' in tenant else None
        location["_id"] = str(location["_id"]) if "_id" in location else None
        location["vector_id"] = str(location["vector_id"]) if "vector_id" in location else None

        # GET THE DEMOGRAPHIC DETAILS (asyc)
        d_process, tenant_demographics = self.obtain_demographics.delay(tenant), []
        tenant_demo_listener = self._celery_listener(d_process, tenant_demographics)
        tenant_demo_listener.start()
        d_process, location_demographics = self.obtain_demographics.delay(location), []
        location_demo_listener = self._celery_listener(d_process, location_demographics)
        location_demo_listener.start()

        # Obtain the keyfacts
        key_facts_demo = self.obtain_key_demographics(location)
        key_facts_nearby = self.obtain_key_nearby(location, key_facts_demo['mile'])
        key_facts_demo.update({
            "num_metro": len(key_facts_nearby["nearby_metro"]),
            "num_universities": len(key_facts_nearby["nearby_university"]),
            "num_hospitals": len(key_facts_nearby["nearby_hospitals"]),
            "num_apartments": len(key_facts_nearby["nearby_apartments"])
        })
        key_facts = key_facts_demo
        location["nearby_metro"] = key_facts_nearby["nearby_metro"]

        # GET THE NEARBY LOCATIONS (async)
        n_process, nearby = self.obtain_nearby.delay(tenant, location), []
        nearby_listener = self._celery_listener(n_process, nearby)
        nearby_listener.start()

        # GET THE PSYCHOGRAPHICS
        top_personas = provider.get_matching_personas(location['psycho1'], tenant['psycho1'])

        # grab the demographic details
        _, tenant_demographics = tenant_demo_listener.join(), tenant_demographics[0]
        _, location_demographics = location_demo_listener.join(), location_demographics[0]
        # get the commute details breifly
        commute = location_demographics[str(key_facts_demo['mile']) + 'mile']['commute']
        demographics = self.combine_demographics(tenant_demographics, location_demographics)

        # grab the nearby details
        _, nearby = nearby_listener.join(), nearby[0]

        response = {
            'status': 200,
            'status_detail': 'Success',
            'result': {
                'match_value': match_value,
                'affinities': {
                    # hardcoded false for now, will be made into values soon
                    'growth': False,
                    'demographics': False,
                    'personas': False,
                    'ecosystem': False
                },
                'key_facts': key_facts,
                'commute': commute,
                'top_personas': top_personas,
                'demographics1': demographics["1mile"],
                'demographics3': demographics["3mile"],
                'demographics5': demographics["5mile"],
                'nearby': nearby
            }
        }

        return Response(response, status=status.HTTP_200_OK)

    def obtain_key_demographics(self, place):
        """
        Obtain the key facts from a location.
        """
        # Only doing 1 mile statistics for now.

        # if place['arcgis_details1']['DaytimePop1'] > 100000:
        #     radius_miles = 1
        #     arcgis_details = place['arcgis_details1']
        # else:
        #     radius_miles = 3
        #     arcgis_details = place['arcgis_details3']

        radius_miles = 1
        arcgis_details = place['arcgis_details1']

        return {
            'mile': radius_miles,
            'DaytimePop': arcgis_details['DaytimePop' + str(radius_miles)],
            'MedHouseholdIncome': arcgis_details['MedHouseholdIncome' + str(radius_miles)],
            'TotalHousholds': arcgis_details['TotalHouseholds' + str(radius_miles)],
            'HouseholdGrowth2017-2022': arcgis_details['HouseholdGrowth2017-2022-' + str(radius_miles)]
        }

    def obtain_key_nearby(self, place, radius):

        lat = place['geometry']['location']['lat']
        lng = place['geometry']['location']['lng']

        nearby_metro = place['nearby_subway_station'] if 'nearby_subway_station' in place else google.nearby(
            lat, lng, 'subway_station', radius=radius)
        # if radius == 1:
        nearby_university = place['nearby_university']
        nearby_hospitals = place['nearby_hospital']
        nearby_apartments = place['nearby_apartments']
        # else:
        #     nearby_university = google.nearby(lat, lng, 'university', radius=radius)
        #     nearby_hospitals = google.nearby(lat, lng, 'hospital', radius=radius)
        #     nearby_apartments = google.search(lat, lng, 'apartments', radius=radius)

        return {
            'nearby_metro': nearby_metro,
            'nearby_university': nearby_university,
            'nearby_hospitals': nearby_hospitals,
            'nearby_apartments': nearby_apartments
        }

    @staticmethod
    @celery_app.task
    def obtain_demographics(place):

        lat = place['geometry']['location']['lat']
        lng = place['geometry']['location']['lng']

        # get demographics for 1, 3, and 5 mile
        return {
            "1mile": provider.get_demographics(lat, lng, 1, demographic_dict=place["demo1"]),
            "3mile": provider.get_demographics(lat, lng, 3, demographic_dict=place["demo3"]),
            "5mile": provider.get_demographics(lat, lng, 5)
        }

    def combine_demographics(self, tenant_demographics, landlord_demographics):

        demographic_radius = ["1mile", "3mile", "5mile"]

        for item in tenant_demographics:
            if 'commute' in tenant_demographics[item]:
                tenant_demographics[item].pop('commute')
        for item in landlord_demographics:
            if 'commute' in landlord_demographics[item]:
                landlord_demographics[item].pop('commute')

        return {
            radius: provider.combine_demographics(
                tenant_demographics[radius],
                landlord_demographics[radius]) for radius in demographic_radius
        }

    @staticmethod
    @celery_app.task
    def obtain_nearby(tenant, location):
        categories = tenant['foursquare_categories'] if 'foursquare_categories' in tenant else []
        return provider.obtain_nearby(location, categories)

    def _register_tasks(self) -> None:
        celery_app.register_task(self.obtain_demographics)
        celery_app.register_task(self.obtain_nearby)


# LocationPreviewAPI - referenced by api/locationPreview/ | inherits from LocationDetailsAPI
class LocationPreviewAPI(LocationDetailsAPI):
    """

    Provided the latitude and longitude of a location, will provide details for a preview.

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
        status: int (HTTP),
        status_detail: string or list[string],
        target_address: string,
        target_neighborhoood: string,
        DaytimePop_3mile: float,
        median_income: float,
        median_age: int
    }

    """

    def get(self, request, *args, **kwargs):

        self._register_tasks()

        # validate input
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        # TODO: determine match value (for next generation preview)

        target_lat = validated_params["target_location"]["lat"]
        target_lng = validated_params["target_location"]["lng"]

        # get demographic details asynchronously
        d_process, preview_demographics = self._get_preview_demographics.delay(target_lat, target_lng, 3), []
        demo_listener = self._celery_listener(d_process, preview_demographics)
        demo_listener.start()

        location = provider.get_address_neighborhood(target_lat, target_lng)
        address = None
        neighborhood = None

        if location:
            address = location['address']
            neighborhood = location['neighborhood']

        daytime_pop_3mile = provider.get_daytimepop(target_lat, target_lng, 3)

        demo_listener.join()

        response = {
            'status': 200,
            'status_detail': "Success",
            'target_address': address,
            'target_neighborhood': neighborhood,
            'DaytimePop_3mile': daytime_pop_3mile,
            'median_income': preview_demographics[0]['median_income'],
            'median_age ': preview_demographics[0]['median_age']
        }

        return Response(response, status=status.HTTP_200_OK)

    @staticmethod
    @celery_app.task
    def _get_preview_demographics(lat, lng, radius):
        return provider.get_preview_demographics(lat, lng, radius)

    def _register_tasks(self) -> None:
        celery_app.register_task(self._get_preview_demographics)


# AutoPopulateAPI - referenced by /api/autoPopulate/
class AutoPopulateAPI(AsynchronousAPI):
    """

    Provided an address and brandname, will provide estimated age and population filters.

    parameters: {
        address: string,            (required)
        brand_name: string,         (required)
    }

    response: {
        categories: list[string],
        personas: list[string],
        income: {
            min: int,
            max: int
        },
        age: {
            min: int,
            max: int
        },
    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = LocationSerializer

    def get(self, request, *args, **kwargs):

        self._register_tasks()

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        location = provider.get_location(validated_params['address'], validated_params['brand_name'])
        my_lat = location['lat']
        my_lng = location['lng']
        place_id = location['place_id']

        # get demographic details asynchronously
        d_process, preview_demographics = self._get_preview_demographics.delay(my_lat, my_lng, 3), []
        demo_listener = self._celery_listener(d_process, preview_demographics)
        demo_listener.start()

        # Get categories (from foursquare)
        categories = provider.get_categories(place_id)
        # Get personas (from spatial taxonomy)
        personas = provider.get_personas(categories)

        # get demographic_filters
        demo_listener.join()
        median_income = preview_demographics[0]['median_income']
        median_age = preview_demographics[0]['median_age']

        # get income | TODO: actually do this using some sort of learning
        min_income = max(0, round(median_income - (median_income % 1000)) - 25000)  # only send in the thousands
        max_income = min(200000, round(median_income - (median_income % 1000)) + 25000)

        # get age | TODO: actually do this using some sort of learning
        min_age = max(5, round(median_age) - 10)
        max_age = min(65, round(median_age) + 10)

        response = {
            'categories': categories,
            'personas': personas,
            'income': {
                'min': min_income,
                'max': max_income
            },
            'age': {
                'min': min_age,
                'max': max_age
            }
        }

        return Response(response, status=status.HTTP_200_OK)

    @staticmethod
    @celery_app.task
    def _get_preview_demographics(lat, lng, radius):
        return provider.get_preview_demographics(lat, lng, radius)

    def _register_tasks(self) -> None:
        celery_app.register_task(self._get_preview_demographics)
