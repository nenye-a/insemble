from rest_framework import status, generics, permissions
from rest_framework.response import Response
from .serializers import TenantMatchSerializer
import data.matching as matching
import json

'''

This file contains the main api interface for the matching algorithm.
The endpoints to access this interface is presented in the "urls.py"
file.

'''


# TenantMatchApi - referenced by api/tenantMatch/
class TenantMatchAPI(generics.GenericAPIView):

    """

    parameters: {
        
    }

    response: {

    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TenantMatchSerializer

    def get(self, request, *args, **kwargs):
        pass

# PropertyMatchApi - referenced by api/propertyMatch/
class PropertyMatchAPI(generics.GenericAPIView):

    """

    parameters: {

    }

    response: {

    }

    """