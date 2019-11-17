from django.http import Http404
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin

from rest_framework import viewsets, permissions
from rest_framework.response import Response

import urllib
import logging

from .types.Venue import Venue
from .types.Retailer import Retailer
from .types.PairedLocation import PairedLocation
from .serializers import *
from users.models import User
from users.serializers import UserSerializer



## Venue viewsets
class VenueViewSet(LoginRequiredMixin, viewsets.ViewSet):
    
    login_url = '/login/'
    redirect_field_name = 'redirect_to'

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
        print(pk)
        p_location = Venue.get_venue(pk)
        serializer = VenueSerializer(p_location)
        return Response(serializer.data)

## Retailer viewsets
class RetailerViewSet(LoginRequiredMixin, viewsets.ViewSet):
    
    login_url = '/login/'
    redirect_field_name = 'redirect_to'

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


# viewset to access generic paired location viewset
class PairedLocationViewSet(LoginRequiredMixin, viewsets.ViewSet):
    
    login_url = '/login'
    redirect_field_name = 'login'
    
    permission_classes= [
        permissions.AllowAny
    ]
    
    """
    A simple ViewSet for listing or retrieving users.
    """
    def list(self, request):
        # queryset = PairedLocation.get_matches(address="8857 Santa Monica Blvd, West Hollywood, CA") - testing for matches
        queryset = PairedLocation.get_paired_locations()
        serializer = PairedLocationSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        # TODO: Test it
        p_location = PairedLocation.get_paired_location(pk)
        serializer = PairedLocationSerializer(p_location)
        return Response(serializer.data) 

# viewset to access any space matches that you generate
class SpaceMatchesViewSet(LoginRequiredMixin, viewsets.ViewSet):

    login_url = '/login'
    redirect_field_name = 'login'
    
    permission_classes= [
        permissions.AllowAny
    ]

    def list(self, request):
        pass

    def retreive(self, request, pk=None):
        pass

# viewset to access any tenant matches that you have
class TenantMatchesViewSet(LoginRequiredMixin, viewsets.ViewSet):

    login_url = '/login'
    redirect_field_name = 'login'
    
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
        
        # genreate matches if request was correctly provided. Otherwise, catch Key error and reject reject request.
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

class UserViewSet(viewsets.ModelViewSet):

    login_url = '/login'
    redirect_field_name = 'login'
    
    """
    A simple ViewSet for listing or retrieving users.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    # def list(self, request):
    #     queryset = User.objects.all()
    #     serializer = UserSerializer(queryset, many=True)
    #     return Response(serializer.data)

    # def retrieve(self, request, pk=None):
    #     queryset = User.objects.all()
    #     user = get_object_or_404(queryset, pk=pk)
    #     serializer = UserSerializer(user)
    #     return Response(serializer.data)