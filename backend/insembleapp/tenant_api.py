import time
import threading
import datetime
import utils
import mongo_connect
import data.matching as matching
import data.provider as provider
import data.landlord_provider as landlord_provider
import data.api.google as google
from bson import ObjectId
from rest_framework import status, generics, permissions, serializers
from rest_framework.response import Response
from .tenant_serializers import TenantMatchSerializer, LocationSerializer, FastLocationDetailSerializer, LocationPreviewSerializer
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
    serializer_class = serializers.Serializer()

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
            'type': ["Free standing", "Shopping Center", "Inline", "Endcap", "Pedestrian"],
            'equipment': provider.EQUIPMENT_LIST
        }
        return Response(response, status=status.HTTP_200_OK)

# TenantMatchApi - referenced by api/tenantMatch/


class TenantMatchAPI(AsynchronousAPI):

    """

    Provided parameters describing a retail location, this endpoint will return the best matching locations within
    the los angeles region.

    GET /api/tenantMatch/:
        Parameters: {
            brand_name: string,             (required)
            address: string,                (required -> not required if categories are provided)
            categories: list[string],       (required -> not required if brand_name and address provided)
            income: {                       (required -> not required if brand_name and address provided)
                min: int,                   (required if income provided)
                max: int                    (optional)
            },
            age: {
                min: int,                   (optional)
                max: int                    (optional)
            },
            personas: list[string],         (optional)
            commute: list[string],          (optional)
            education: list[string],        (optional)
            ethnicity: list[string],        (optional)
            min_daytime_pop: int,           (optional)
            rent: {                         (optional)
                min: int,                   (required if rent provided)
                max: int                    (optional)
            },
            sqft: {                         (optional)
                min: int,                   (required if rent provided)
                max: int
            },
            frontage_width: int,            (optional)
            property_type: list[string]     (optional)
            match_id: string                (optional - only provide if wishing to update specific match)
        }

        Response: {
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
                    space_id: string,
                    space_condition: list[string],
                    tenant_type: list[string],
                    type: list[string],
                    rent: 90000,
                    sqft: int,
                    pro: boolean,
                    visible: boolean,
                    address: string,
                    lat: float,
                    lng: float,
                    match_value: float
                }
                ... many more
            ],
            match_id: string                   (always provided)
            brand_id: string                   (always provided)
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

        params = None
        if 'match_id' in validated_params:
            location_match = utils.DB_LOCATION_MATCHES.find_one({'_id': ObjectId(validated_params['match_id'])})
            if not location_match:
                return Response({
                    'status': status.HTTP_404_NOT_FOUND,
                    'status_detail': ["Could not find a match record that matches that Id."]
                }, status=status.HTTP_404_NOT_FOUND)
            params = location_match['params']
            params = self.update_params(validated_params, params)
        else:
            params = self.update_params(validated_params)

        # OBTAIN DETAILS OF LOCATION
        name = params['brand_name']
        if 'address' in params and params['address']:
            address = params['address']
            google_location = google.find(address, name=name, allow_non_establishments=True, save=False)
            lat = round(google_location["geometry"]["location"]["lat"], 6)
            lng = round(google_location["geometry"]["location"]["lng"], 6)

            # associate this location with a place and then a brand (assign one if exists already)
            place = utils.DB_PLACES.find_one({'google_place_id': google_location['place_id']})
            if place:
                brand_id = place['brand_id']
            else:
                place = provider.import_place_details(google_location['place_id'])
                brand_id = place['brand_id'] if place else None
        else:
            categories = params['categories']
            location = provider.get_representative_location(categories, params['income'])
            if not location:
                return Response({
                    'status': 200,
                    'status_detail': ["No matches found for that category with the specified income. "
                                      "You should try increasing the income range or adjusting category."],
                    'result': {}
                })
            lat = location['lat']
            lng = location['lng']

            # associate this location with a brand and updae the brand
            brand = provider.get_brand(name)
            if brand:
                brand_id = brand['_id']
            else:
                brand_id = provider.build_brand(name, categories, params)

        n_process, nearby = self.get_nearby_places.delay(lat, lng, parallel_process=True), []
        nearby_listener = self._celery_listener(n_process, nearby)
        nearby_listener.start()

        location = landlord_provider.build_location(lat, lng)
        _, nearby = nearby_listener.join(), nearby[0]
        location.update(nearby)

        if '_id' in location:
            utils.DB_LOCATIONS.update({"_id": location['_id']}, location)
            params['location_id'] = str(location['_id'])
        else:
            params['location_id'] = str(utils.DB_LOCATIONS.insert(location))

        # GENERATE LOCATION & PROPERTY MATCHES
        best_matches, location_matches = matching.generate_matching_locations(location, params)
        property_matches = provider.generate_matching_properties(location, params)

        match_update = {
            'params': params,
            'location_match_values': location_matches
        }

        try:
            utils.DB_LOCATION_MATCHES.update({'_id': location_match['_id']}, {'$set': match_update})
            match_id = location_match['_id']

            # update the mongodb match_request time of update
            utils.DB_BRANDS.update_one({'_id': brand_id}, {'$set': {
                'match_requests.$[element].last_update': datetime.datetime.utcnow().replace(microsecond=0).isoformat()
            }}, array_filters=[{'element.match_id': ObjectId(match_id)}])
        except NameError:
            match_id = utils.DB_LOCATION_MATCHES.insert(match_update)
            utils.DB_BRANDS.update({'_id': brand_id}, {'$push': {
                'match_requests': {
                    'last_update': datetime.datetime.utcnow().replace(microsecond=0).isoformat(),
                    'match_id': ObjectId(match_id),
                    'region_id': None,
                    'type': None,
                    'status': "Active User"
                }
            }})

        response = {
            'status': status.HTTP_200_OK,
            'status_detail': "Success",
            'match_id': str(match_id),
            'brand_id': str(brand_id),
            'matching_properties': property_matches,
            'matching_locations': best_matches,
        }
        return Response(response, status=status.HTTP_200_OK)

    def build_location(self, address, brand_name=None):
        return provider.build_location(address, brand_name=brand_name)

    def update_params(self, params, existing_params=None):

        address = existing_params['address'] if existing_params and 'address' in existing_params else None
        brand_name = existing_params['brand_name'] if existing_params and 'brand_name' in existing_params else None
        categories = existing_params['categories'] if existing_params and 'categories' in existing_params else []
        income = existing_params['income'] if existing_params and 'income' in existing_params else {}
        age = existing_params['age'] if existing_params and 'age' in existing_params else {}
        personas = existing_params['personas'] if existing_params and 'personas' in existing_params else []
        commute = existing_params['commute'] if existing_params and 'commute' in existing_params else []
        education = existing_params['education'] if existing_params and 'education' in existing_params else []
        ethnicity = existing_params['ethnicity'] if existing_params and 'ethnicity' in existing_params else []
        min_daytime_pop = existing_params['min_daytime_pop'] if existing_params and 'min_daytime_pop' in existing_params else None
        rent = existing_params['rent'] if existing_params and 'rent' in existing_params else {}
        sqft = existing_params['sqft'] if existing_params and 'sqft' in existing_params else {}
        frontage_width = existing_params['frontage_width'] if existing_params and 'frontage_width' in existing_params else None
        property_type = existing_params['property_type'] if existing_params and 'property_type' in existing_params else []

        updated_params = existing_params if existing_params else {}
        updated_params.update({
            'address': params['address'] if 'address' in params else address,
            'brand_name': params['brand_name'] if 'brand_name' in params else brand_name,
            'categories': params['categories'] if 'categories' in params else categories,
            'income': params['income'] if 'income' in params else income,
            'age': params['age'] if 'age' in params else age,
            'personas': params['personas'] if 'personas' in params else personas,
            'commute': params['commute'] if 'commute' in params else commute,
            'education': params['education'] if 'education' in params else education,
            'ethnicity': params['ethnicity'] if 'ethnicity' in params else ethnicity,
            'min_daytime_pop': params['min_daytime_pop'] if 'min_daytime_pop' in params else min_daytime_pop,
            'rent': params['rent'] if 'rent' in params else rent,
            'sqft': params['sqft'] if 'sqft' in params else sqft,
            'frontage_width': params['frontage_width'] if 'frontage_width' in params else frontage_width,
            'property_type': params['property_type'] if 'property_type' in params else property_type
        })

        return updated_params

    @staticmethod
    @celery_app.task
    def generate_matches(address, name, options):
        connection = mongo_connect.Connect()
        matches = matching.generate_matches(address, name=name, options=options, db_connection=connection)
        connection.close()
        return matches

    @staticmethod
    @celery_app.task
    def get_spatial_personas(lat, lng, parallel_process=False):
        # open up new mongo connection if forking the process
        connection = mongo_connect.Connect() if parallel_process else utils.SYSTEM_MONGO
        personas = provider.get_spatial_personas(lat, lng, db_connection=connection)
        connection.close() if connection != utils.SYSTEM_MONGO else None
        return personas

    @staticmethod
    @celery_app.task
    def get_environics_demographics(lat, lng, parallel_process=False):
        # open up new mongo connection if forking the process
        connection = mongo_connect.Connect() if parallel_process else utils.SYSTEM_MONGO
        demographics = provider.get_environics_demographics(lat, lng, db_connection=connection)
        connection.close() if connection != utils.SYSTEM_MONGO else None
        return demographics

    @staticmethod
    @celery_app.task
    def get_nearby_places(lat, lng, parallel_process=False):
        connection = mongo_connect.Connect() if parallel_process else utils.SYSTEM_MONGO
        nearby = provider.get_nearby_places(lat, lng, db_connection=connection)
        connection.close() if connection != utils.SYSTEM_MONGO else None
        return nearby

    def _register_tasks(self) -> None:
        celery_app.register_task(self.generate_matches)
        celery_app.register_task(self.get_spatial_personas)
        celery_app.register_task(self.get_environics_demographics)
        celery_app.register_task(self.get_nearby_places)


class FastLocationDetailsAPI(AsynchronousAPI):

    """

    /api/fastLocationDetails

    Parameters:
        {
            match_id: string,                      (required)
            target_location: {                      (required, not used if property_id is provided)
                lat: int,
                lng: int,
            },
            property_id: string                     (optional)
        }

    Response:
        {
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
            ## Following to be removed pending team answer
            # property_details: {                                                 (only provided if property_details provided)
            #     3D_tour: url, (matterport media)                                (provided only when available)
            #     main_photo: url,
            #     sqft: int,
            #     photos: list[urls],
            #     summary: {
            #         price/sqft: int,
            #         type: string,
            #         condition: string
            #     },
            #     description: string
            # }
        }

    """

    serializer_class = FastLocationDetailSerializer

    def get(self, request, *args, **kwargs):

        self._register_tasks()

        # validate request
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        # Obtain representative locations
        match_id = validated_params['match_id']
        property_id = validated_params['property_id'] if 'property_id' in validated_params else None

        # grab match record if exists. Grab from legacy database if not in latest database.
        match = utils.DB_LOCATION_MATCHES.find_one({'_id': ObjectId(match_id)}, {'location_match_values': 0})

        if match:  # if generating the details using the latest schema
            if property_id:
                this_property = utils.DB_PROPERTY.find_one({'_id': ObjectId(property_id)})
                this_location = utils.DB_property.find_one({'_id': this_property['location_id']})
                target_lat = this_location['location']['coordinates'][1]
                target_lng = this_location['location']['coordinates'][0]
            else:
                target_lat = round(validated_params["target_location"]["lat"], 6)
                target_lng = round(validated_params["target_location"]["lng"], 6)
                # grab the nearby stores asynchronously
                n_process, nearby = TenantMatchAPI.get_nearby_places.delay(target_lat, target_lng, parallel_process=True), []
                nearby_listener = self._celery_listener(n_process, nearby)
                nearby_listener.start()

                this_location = landlord_provider.build_location(target_lat, target_lng)
                _, nearby = nearby_listener.join(), nearby[0]

                this_location.update(nearby)
                if '_id' in this_location:
                    utils.DB_LOCATIONS.update({"_id": this_location['_id']}, this_location)
                else:
                    utils.DB_LOCATIONS.insert(this_location)

            location_id = ObjectId(match['params']['location_id'])
            tenant_location = utils.DB_LOCATIONS.find_one({'_id': location_id})

            top_personas = provider.get_matching_personas(tenant_location['spatial_psychographics']["1mile"],
                                                          this_location['spatial_psychographics']["1mile"])

            tenant_demographics = self.convert_demographics(tenant_location['environics_demographics'])
            location_demographics = self.convert_demographics(this_location['environics_demographics'])

            demographics = {}
            demographics["1mile"] = provider.combine_demographics(tenant_demographics["1mile"], location_demographics["1mile"])
            demographics["3mile"] = provider.combine_demographics(tenant_demographics["3mile"], location_demographics["3mile"])
            demographics["5mile"] = provider.combine_demographics(tenant_demographics["5mile"], location_demographics["5mile"])

            try:
                commute = demographics["1mile"].pop("commute") if 'commute' in demographics["1mile"] else None
                demographics["3mile"].pop("commute") if 'commute' in demographics["1mile"] else None
                demographics["5mile"].pop("commute") if 'commute' in demographics["1mile"] else None
            except Exception:
                commute = None

            # TODO: factor in similar categories
            nearby = self.obtain_nearby({}, this_location, parallel_process=False)

            key_facts = this_location['arcgis_demographics']['1mile'] or {}
            if key_facts != {}:
                key_facts.pop('DaytimeWorkingPop')
                key_facts.pop('DaytimeResidentPop')

            key_facts['num_metro'] = len(this_location['nearby_subway_station'] if 'neaby_subway_station' in this_location else google.nearby(
                target_lat, target_lng, 'subway_station', radius=1))
            key_facts['num_universities'] = len(this_location['nearby_university'] if 'nearby_university' in this_location else google.nearby(
                target_lat, target_lng, 'university', radius=1))
            key_facts['num_hospitals'] = len(this_location['nearby_hospitals'] if 'nearby_hospitals' in this_location else google.nearby(
                target_lat, target_lng, 'hospital', radius=1))
            key_facts['nearby_apartments'] = len(this_location['nearby_apartments'] if 'nearby_apartments' in this_location else google.search(
                target_lat, target_lng, 'apartments', radius=1))

            vector_id = provider.get_location_details({'lat': target_lat, 'lng': target_lng})['vector_id']
            match_value = provider.get_match_value_from_id(match_id, vector_id)

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
        else:  # PROCESS THINGS WITH PREVIOUS META

            # get the tenant details
            tenant = provider.get_tenant_details(validated_params["match_id"])
            if not tenant:
                return Response({
                    'status': status.HTTP_404_NOT_FOUND,
                    'status_detail': ['Match was not found, please make sure to check the id.']
                }, status=status.HTTP_404_NOT_FOUND)

            # get the location and property detials
            if 'property_id' in validated_params:
                location = provider.get_property(validated_params["property_id"])
            else:
                print(validated_params)
                location = provider.get_location_details(validated_params["target_location"])

                if not location:
                    pass

            # get the match value
            match_value = provider.get_match_value_from_id(validated_params["match_id"], location['vector_id'], latest=False)

            # stringify the objectIds
            tenant["_id"] = str(tenant["_id"]) if '_id' in tenant else None
            location["_id"] = str(location["_id"]) if "_id" in location else None
            location["vector_id"] = str(location["vector_id"]) if "vector_id" in location else None

            # get the demographic details asynchronously
            d_process, tenant_demographics = self.obtain_demographics.delay(tenant, parallel_process=True), []
            tenant_demo_listener = self._celery_listener(d_process, tenant_demographics)
            tenant_demo_listener.start()
            d_process, location_demographics = self.obtain_demographics.delay(location, parallel_process=True), []
            location_demo_listener = self._celery_listener(d_process, location_demographics)
            location_demo_listener.start()

            # obtain the key facts
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

            # get the nearby locations
            n_process, nearby = self.obtain_nearby.delay(tenant, location, parallel_process=True), []
            nearby_listener = self._celery_listener(n_process, nearby)
            nearby_listener.start()

            # get the psychographics
            top_personas = provider.get_matching_personas(location['psycho1'], tenant['psycho1'])

            # process the demogrpahics
            _, tenant_demographics = tenant_demo_listener.join(), tenant_demographics[0]
            _, location_demographics = location_demo_listener.join(), location_demographics[0]

            # get the commute details
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
        nearby_university = place['nearby_university'] if 'nearby_university' in place else google.nearby(
            lat, lng, 'university', radius=radius)
        nearby_hospitals = place['nearby_hospital'] if 'nearby_hospital' in place else google.nearby(
            lat, lng, 'hospital', radius=radius)
        nearby_apartments = place['nearby_apartments'] if 'nearby_apartments' in place else google.search(
            lat, lng, 'apartments', radius=radius)

        return {
            'nearby_metro': nearby_metro,
            'nearby_university': nearby_university,
            'nearby_hospitals': nearby_hospitals,
            'nearby_apartments': nearby_apartments
        }

    @staticmethod
    @celery_app.task
    def obtain_demographics(place, parallel_process=False):

        lat = place['geometry']['location']['lat']
        lng = place['geometry']['location']['lng']

        connection = mongo_connect.Connect() if parallel_process else utils.SYSTEM_MONGO

        try:
            onemile_demo = provider.get_demographics(lat, lng, 1, demographic_dict=place["demo1"], db_connection=connection)
        except Exception:
            onemile_demo = None

        try:
            threemile_demo = provider.get_demographics(lat, lng, 3, demographic_dict=place["demo3"], db_connection=connection)
        except Exception:
            threemile_demo = None

        try:
            fivemile_demo = provider.get_demographics(lat, lng, 5, db_connection=connection)
        except Exception:
            fivemile_demo = None

        connection.close() if connection != utils.SYSTEM_MONGO else None
        # get demographics for 1, 3, and 5 mile
        return {
            "1mile": onemile_demo,
            "3mile": threemile_demo,
            "5mile": fivemile_demo
        }

    def convert_demographics(self, demographic_dict):
        return {
            '1mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['1mile']),
            '3mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['3mile']),
            '5mile': provider.get_demographics(1, 1, 1, demographic_dict=demographic_dict['5mile'])
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
    def obtain_nearby(tenant, location, parallel_process=False):
        connection = mongo_connect.Connect() if parallel_process else utils.SYSTEM_MONGO
        categories = tenant['foursquare_categories'] if 'foursquare_categories' in tenant else []
        nearby = provider.obtain_nearby(location, categories)
        connection.close() if connection != utils.SYSTEM_MONGO else None
        return nearby

    def _register_tasks(self) -> None:
        celery_app.register_task(self.obtain_demographics)
        celery_app.register_task(self.obtain_nearby)


# LocationPreviewAPI - referenced by api/locationPreview/ | inherits from LocationDetailsAPI
class LocationPreviewAPI(AsynchronousAPI):
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
        target_location: {                      
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

    serializer_class = LocationPreviewSerializer

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
        preview_demographics = self._get_preview_demographics(target_lat, target_lng, 3)
        location = provider.get_address_neighborhood(target_lat, target_lng)
        address = None
        neighborhood = None

        if location:
            address = location['address']
            neighborhood = location['neighborhood']

        daytime_pop_3mile = provider.get_daytimepop(target_lat, target_lng, 3)

        response = {
            'status': 200,
            'status_detail': "Success",
            'target_address': address,
            'target_neighborhood': neighborhood,
            'DaytimePop_3mile': daytime_pop_3mile,
            'median_income': preview_demographics['median_income'],
            'median_age ': preview_demographics['median_age']
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
        preview_demographics = self._get_preview_demographics(my_lat, my_lng, 3)

        # Get categories (from foursquare)
        categories = provider.get_categories(place_id)
        # Get personas (from spatial taxonomy)
        personas = provider.get_personas(categories)

        # get demographic_filters
        median_income = preview_demographics['median_income']
        median_age = preview_demographics['median_age']

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
