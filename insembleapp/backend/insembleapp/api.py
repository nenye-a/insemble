from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .types.Location import Location
from .types.Retailer import Retailer
from .types.PairedLocation import PairedLocation
from .serializers import *

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


# PairedLocation viewsets
class PairedLocationViewSet(viewsets.ViewSet):

    permission_classes= [
        permissions.AllowAny
    ]
    
    """
    A simple ViewSet for listing or retrieving users.
    """
    def list(self, request):

        queryset = PairedLocation.get_paired_locations()
        serializer = PairedLocationSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):

        queryset = PairedLocation.get_paired_location(pk)
        p_location = get_object_or_404(queryset, pk=pk) # make sure to adjust this to retreive a specific retailer
        serializer = PairedLocationSerializer(p_location)
        return Response(serializer.data)