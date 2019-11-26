from django.http import Http404
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin

from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response

import urllib
import logging

from .types.Venue import Venue
from .types.Retailer import Retailer
from .types.Location import PairedLocation, MapLocation, return_location, return_matches, return_location_with_address
from .serializers import *
import data_insights.category_management as cm


# VENUE VIEWSET METHODS
class VenueViewSet(viewsets.ViewSet):

    permission_classes= [
        permissions.AllowAny
    ]

    """
    A simple ViewSet for listing or retrieving venues.
    """
    def list(self, request):
        queryset = Venue.get_venues(paired=True)
        serializer = VenueSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        p_location = Venue.get_venue(pk)
        serializer = VenueSerializer(p_location)
        return Response(serializer.data)

    def create(self, request):
        serializer = VenueSerializer(data=request.data, partial=True)

        try:
            insert_request = serializer.initial_data

            address = insert_request["address"]
            owner_username = insert_request["owner_username"]
            about_text = None
            if insert_request["about_text"]: about_text = insert_request["about_text"]
            venue_age = None
            if insert_request["venue_age"]: venue_age = insert_request["venue_age"]
            photo = None
            if insert_request["photo"]: photo = insert_request["photo"]
            icon = None
            if insert_request["icon"]: icon = insert_request["icon"]
            name = None
            if insert_request["name"]: name = insrt_request["name"]

            Venue.add_venue(address, owner_username, about_text=about_text, venue_age=venue_age,
                             photo=photo, icon=icon, name=name)
            return Response(serializer.initial_data, status=status.HTTP_201_CREATED)
        except:
            return Response("Failed request", status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        pass

    def partial_update(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass


# RETAILER VIEWSET METHODS
class RetailerViewSet(viewsets.ViewSet):

    permission_classes= [
        permissions.AllowAny
    ]

    """
    A simple ViewSet for listing or retrieving retailers.
    """
    def list(self, request):

        queryset = Retailer.get_retailers()
        serializer = RetailerSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):

        retailer = Retailer.get_retailer(pk)
        serializer = RetailerSerializer(retailer)
        return Response(serializer.data)

    def create(self, request):

        #TODO: update to make use of the other optional fields

        serializer = RetailerSerializer(data=request.data, partial=True)

        try:
            insert_request = serializer.data

            name = insert_request["name"]
            location = insert_request["location"]
            owner_username = insert_request["owner_username"]
            about_text = None
            if insert_request["about_text"]: about_text = insert_request["about_text"]
            preferences = None
            if insert_request["preferences"]: preferences = insert_request["preferences"]
            requirements = None
            if insert_request["requirements"]: requirements = insert_request["requirements"]
            photo = None
            if insert_request["photo"]: photo = insert_request["photo"]
            icon = None
            if insert_request["icon"]: icon = insert_request["icon"]

            Retailer.add_retailer(name, location, owner_username, about_text=about_text, preferences=preferences,
                            requirements=requirements, photo=photo, icon=icon)
            return Response(serializer.initial_data, status=status.HTTP_201_CREATED)
        except:
            return Response("Failed request", status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        pass

    def partial_update(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass


# GENERIC PAIRED LOCATION VIEWSET
class PairedLocationViewSet(viewsets.ViewSet):

    """
    A simple ViewSet for listing or retrieving users.
    """

    permission_classes= [
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

    permission_classes= [
        permissions.AllowAny
    ]

    def list(self, request):
        raise Http404('<h1>Page not found</h1>')

    def retrieve(self, request, pk=None):
        pass

    def create(self, request):
        print(" ")
        print(request.data)
        print(" ")
        
        try:
            address = request.data["address"]
            place_type = {}
            if "place_type" in request.data:
                place_type = request.data["place_type"]
        except:
            return Response("Response must include 'address', prefereably of best location.")

        matches = MapLocation.get_tenant_matches(address, place_type)

        serializer = MapSerializer(matches, many=True)
        return Response(serializer.data)

# VIEW AND PROVIDE TENANT MATCHES FOR A VENUE
class TenantMatchesViewSet(viewsets.ViewSet):

    permission_classes= [
        permissions.AllowAny
    ]

    def list(self,request):
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
                matches = PairedLocation.get_matches(_id=d["id"]) # pending definition (pagination not implemented)
            else:
                address = urllib.parse.unquote(d["address"])
                matches = PairedLocation.get_matches(address=address)
        except KeyError:
            return Response("Request must include an 'id' or an 'address'.")

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
            raise Exception("lat, lng, and radius required in request. Please resubmit with params /lat=##&lng=##&radius=##")

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

        map_points = return_matches(serializer.data)

        serializer = MapSerializer(map_points, many=True)
        return Response(serializer.data)
