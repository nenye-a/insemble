import data.category_management as cm
import data.matching as matching
from .celery import app as celery_app
from .legacy_serializers import MatchSerializer
from .legacy_serializers import PairedLocationSerializer, CategoryMapSerializer, MapSerializer, SearchSerializer
from .types.Location import PairedLocation, MapLocation, return_location, return_matches, return_location_with_address
from .types.matcher import temp_generate_profile_matches, temp_retrieve_profile_matches
import json
from django.http import Http404

from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response

import urllib


# GENERIC PAIRED LOCATION VIEWSET
class PairedLocationViewSet(viewsets.ViewSet):

    """
    A simple ViewSet for listing or retrieving users.
    """

    permission_classes = [
        permissions.AllowAny
    ]

    def list(self, request):
        queryset = PairedLocation.get_paired_locations()
        serializer = PairedLocationSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        # TODO: Test it
        p_location = PairedLocation.get_paired_location(pk)
        serializer = PairedLocationSerializer(p_location)
        return Response(serializer.data)


# VIEW AND PROVIDE VENUE MATCHES FOR A TENANT
class SpaceMatchesViewSet(viewsets.ViewSet):

    permission_classes = [
        permissions.AllowAny
    ]

    def list(self, request):
        raise Http404('<h1>Page not found</h1>')

    def retrieve(self, request, pk=None):
        pass

    def create(self, request):

        try:
            id = request.data["id"]
            print(id)
            result = celery_app.AsyncResult(id)
        except:
            try:
                address = request.data["address"]
                place_type = {}
                if "place_type" in request.data:
                    place_type = request.data["place_type"]
            except:
                return Response("Response must include 'address', prefereably of best location.", status=status.HTTP_400_BAD_REQUEST)

            celery_app.register_task(self.create_worker)
            result = self.create_worker.delay(address, place_type)

        if result.ready():
            return Response(result.get(timeout=2), status=status.HTTP_200_OK)
        else:
            return Response({"id": result.id}, status=status.HTTP_202_ACCEPTED)

    # worker tas to generate map locations
    @staticmethod
    @celery_app.task
    def create_worker(address, place_type):

        matches = MapLocation.get_tenant_matches(address, place_type)
        serializer = MapSerializer(matches, many=True)

        return serializer.data


# VIEW AND PROVIDE TENANT MATCHES FOR A VENUE
class TenantMatchesViewSet(viewsets.ViewSet):

    permission_classes = [
        permissions.AllowAny
    ]

    def list(self, request):
        raise Http404('<h1>Page not found</h1>')

    def retrieve(self, request, pk=None):
        """
        Retreive takes in the following keywords and determines the best matches to return:

        address: address of location that needs matches, this can be provied in lieu of an id.
                 If both are provided, id will be used to generate the match. (Required if no id provided).
        id: database id of location that needs matches, this can be provided in lieu of an address.
            If both are provided, id will be used to generate the match (Required if no address).
        page: page indicating which page of results to return. Matches returned in batches of 30.
        returns: Json object matching IDs (NOT IMPLEMENTED YET)
        """
        args = pk.split("&")
        d = {}

        # parse the arguments
        for arg in args:
            arg = arg.split("=")
            d[arg[0]] = arg[1]

        # generate matches if request was correctly provided. Otherwise, catch Key error and reject reject request.
        matches = []
        try:
            if "id" in d:
                # pending definition (pagination not implemented)
                matches = PairedLocation.get_matches(_id=d["id"])
            else:
                address = urllib.parse.unquote(d["address"])
                matches = PairedLocation.get_matches(address=address)
        except KeyError:
            return Response("Request must include an 'id' or an 'address'.", status=status.HTTP_400_BAD_REQUEST)

        serializer = PairedLocationSerializer(matches, many=True)
        return Response(serializer.data)


# PROVIDE ADHOC INFORMATION ON MARKERS PROVIDED BY MAPPING SOFTWARE
class LocationInfoViewSet(viewsets.ViewSet):

    permission_classes = [
        permissions.AllowAny
    ]

    def retrieve(self, request, pk=None):
        args = pk.split('&')
        d = {}

        # parse the arguments
        for arg in args:
            arg = arg.split("=")
            d[arg[0]] = arg[1]

        lat = None
        lng = None
        radius = None
        if "lat" in d and "lng" in d and "radius" in d:
            lat_string = d["lat"]
            lng_string = d["lng"]
            radius = float(d["radius"])
            lat = float(lat_string[:2]+'.'+lat_string[2:])
            lng = float(lng_string[:4]+'.'+lng_string[4:])
            return Response(return_location(lat, lng, radius))
        elif "address" in d and "radius" in d:
            address = d["address"]
            radius = float(d["radius"])
            return Response(return_location_with_address(address, radius))
        else:
            return Response("Error, location not found. Please check request.", status=status.HTTP_400_BAD_REQUEST)


# GENERATE HEATMAP LOCATIONS FROM INCOME, PRICE, & CATEGORIES
class CategoryMapAPI(generics.GenericAPIView):

    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]

    serializer_class = CategoryMapSerializer

    def get(self, request, *args, **kwargs):
        """

        :return:
        """
        return Response(cm.pull_categories())

    def post(self, request, *args, **kwargs):
        """
        Request to receive mapping of hot locations given income, price,
        area_type, and applicable categories.

        Request must come in the following form:

        request.data = {
            "income": 120,000,
            "categories": ["restaurant", "pizza"],
        }

        #### NOTE OUTDATED - PLEASE THAT THE ACTUAL RETURN WILL BE THAT OF LOCATION OBJECTS
        Output will be in the following form = Response({
            ""
            "length": sizeOfResults,        # size of results
            "results": [{                   # list of all heatmap points
                "lat": latitude_value,      # latitude of point
                "lng": longitude_value,     # longitude of point
                "map_rating": heat          # heat will range from 1-20
            },{
                "lat": latitude_value,
                "lng": longitude_value,
                "map_rating":
            }]
        })

        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # map_points = return_matches(serializer.data)
        celery_app.register_task(self.post_worker)
        result = self.post_worker.delay(serializer.data)

        if result.ready():
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"id": result.id}, status=status.HTTP_202_ACCEPTED)

    @staticmethod
    @celery_app.task
    def post_worker(data):
        map_points = return_matches(data)
        serializer = MapSerializer(map_points, many=True)
        return serializer.data


# On queue for rename from 'Search' to 'Category'
#
# Viewset for handling search requests. Will pass to backend functions that will be responsible
# for supplying the match
class SearchAPI(generics.GenericAPIView):

    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]

    queryset = []
    serializer_class = SearchSerializer

    def get(self, request, *args, **kwargs):
        """

        Given an ID, searches matches database to retrieve pre-processed matches.

        """
        print(kwargs)
        _id = kwargs.get('_id', None)
        if not _id:
            return Response({'status': "Failed_Request"}, status=status.HTTP_400_BAD_REQUEST)

        # try:
        matches = temp_retrieve_profile_matches(_id)
        return Response(matches, status=status.HTTP_200_OK)
        # except:
        #     return Response({'status': "Failed_Request"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        """

        Post request to accept the information for categories, property criteria, and demographics.
        Request data should come in the following form:

        payload = {
            'categories': ['','',''],  # list of strings
            'target_age': {
                'min': ####,
                'max': ####
            } # integer range seperated by comma
            'target_income': {
                'min': ####,
                'min': ####
            }
            'target_psychographics': ['','',''] list of strings
            'property_criteria': {
                # criteria details
            }
        }

        """
        # Receive and parse the data with a Django provided serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO: Evaluate & store the data in a database to be retrieved by the front_end
        # when required. In the short term, this function will simply return the payload
        # and a 200 OK status.

        try:
            _id = temp_generate_profile_matches(serializer.data)
        except:
            return Response("Failed to generate matches", status=status.HTTP_400_BAD_REQUEST)

        return Response({'_id': _id}, status=status.HTTP_200_OK)


class MatchesAPI(generics.GenericAPIView):

    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]
    queryset = []

    serializer_class = MatchSerializer

    def get(self, request, *args, **kwargs):
        """
        Given an address, returns matches for the user.
        """
        address = kwargs.get('address', None)
        if not address:
            return Response({'status': "Failed_Request"}, status=status.HTTP_400_BAD_REQUEST)

        matches = matching.generate_matches_v1(address)
        matches = json.loads(matches)

        return Response(matches, status=status.HTTP_200_OK)
