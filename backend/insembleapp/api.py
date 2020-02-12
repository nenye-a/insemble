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
        status_detail: string,              (always provided)
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
        validated_params = serializer.data

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


# PropertyMatchApi - referenced by api/propertyMatch/
class PropertyMatchAPI(generics.GenericAPIView):

    """

    parameters: { }

    response: { }

    """