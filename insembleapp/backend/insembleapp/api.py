from django.http import Http404
from rest_framework import viewsets, permissions
from rest_framework.response import Response
import urllib
from .types.EmptyLocation import EmptyLocation
from .types.Retailer import Retailer
from .types.PairedLocation import PairedLocation
from .serializers import *

import logging

# # Location viewsets
# class LocationViewSet(viewsets.ViewSet):

#     permission_classes= [
#         permissions.AllowAny
#     ]

#     """
#     A simple ViewSet for listing or retrieving users.
#     """
#     def list(self, request):

#         # FIXME: create method to retreive all Locations in the Location class
#         queryset = Location.objects.all()
#         serializer = LocationSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def retrieve(self, request, pk=None):

#         # FIXME: create method to retreive all Locations in the Retailer class
#         queryset = Location.objects.all()
#         location = get_object_or_404(queryset, pk=pk) # make sure to adjust this to retreive a specific location
#         serializer = LocationSerializer(location)
#         return Response(serializer.data)

# # Retailer viewsets
# class RetailerViewSet(viewsets.ViewSet):

#     permission_classes= [
#         permissions.AllowAny
#     ]

#     """
#     A simple ViewSet for listing or retrieving users.
#     """
#     def list(self, request):

#         # FIXME: create method to retreive all Retailer in the Location class
#         queryset = Retailer.objects.all()
#         serializer = RetailerSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def retrieve(self, request, pk=None):

#         # FIXME: create method to retreive all Retailer in the Retailer class
#         queryset = Retailer.objects.all()
#         retailer = get_object_or_404(queryset, pk=pk) # make sure to adjust this to retreive a specific retailer
#         serializer = RetailerSerializer(retailer)
#         return Response(serializer.data)


# viewset to access generic paired location viewset
class PairedLocationViewSet(viewsets.ViewSet):

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
class SpaceMatchesViewset(viewsets.ViewSet):

    permission_classes= [
        permissions.AllowAny
    ]

    def list(self, request):
        pass

    def retreive(self, request, pk=None):
        pass

# viewset to access any tenant matches that you have
class TenantMatchesViewset(viewsets.ViewSet):

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

    
    
    
