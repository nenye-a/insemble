from rest_framework import status, generics, permissions
from rest_framework.response import Response
from .serializers import TenantMatchSerializer
import data.matching as matching
import json

'''

This file contains the landlord api interface for the matching algorithm.
The endpoints to access this interface is presented in the "urls.py"
file.

'''


# TODO: implement api functions for the landlord api
# PropertyMatchApi - referenced by api/propertyMatch/
class PropertyMatchAPI(generics.GenericAPIView):

    """

    parameters: { }

    response: { }

    """
    pass
