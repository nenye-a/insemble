import json
import data.matching as matching
from rest_framework import status, generics, permissions, serializers
from rest_framework.response import Response
from .tenant_serializers import TenantMatchSerializer

'''

This file contains the main api interface for the matching algorithm.
The endpoints to access this interface is presented in the "urls.py"
file.

'''


# FilterDetailApi - referenced by api/filter/
class FilterDetailAPI(generics.GenericAPIView):
    """

    API holder for receiving all the filter information.

    parameters: {}

    response: {
        status: int,                                (always provided)
        status_detail: string or list[string],      (always provided)
        brand_categories: list[string],             (always provided)
        personas: list[string],          (always provided)
        income: list[string],                       (always provided)
        age: list[string],                          (always provided)
        education: list[string],                    (always provided)
        commute: list[string],                      (always provided)
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
            'brand_categories': matching.FOURSQUARE_CATEGORIES,
            'personas': matching.SPATIAL_CATEGORIES,
            'income': matching.INCOME_LIST,
            'age': matching.AGE_LIST,
            'education': matching.EDUCATION_LIST,
            'commute': matching.TRANSPORT_LIST
        }

        return Response(response, status=status.HTTP_200_OK)

# TenantMatchApi - referenced by api/tenantMatch/


class TenantMatchAPI(generics.GenericAPIView):

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


# LocationQueryApi - referenced by api/locationQuery/
class LocationQueryAPI(generics.GenericAPIView):

    """

    Provided two locations to compare, this api will generate the match details between each.

    parameters: {
        my_location: {                          (required)
            address: string,
            brand_name: string,
        },
        target_location: {                      (required)
            lat: int,
            lng: int,
        },
        property_id: string,                    (optional)
    }

    response: {
        status: int (HTTP),                     (always provided)
        status_detail: string,                  (always provided)
        result: {                               (not provided if error occurs)
            match_value: float,                 
            affinities: {
                growth: boolean,
                personas: boolean,
                demographics: boolean,
                ecosystem: boolean,
            },
            day_time_population: float,
            medium_household_income: float,
            total_households: float,
            household_growth: float,
            top_personas: [
                {
                    percentile: float,
                    name: string,
                    description: string,
                    tag: string
                },
                { ... same as above },
                { ... same as above }
            ],
            demographics: {
                age: {
                    under_eighteen: {
                        my_location: float,
                        target_location: float,
                        growth: float
                    },
                    eighteen_twentyfour: { ... same as above },
                    twentyfive_thirtyfour: { ... same as above },
                    thirtyfive_fourtyfour: { ... same as above },
                    fourtyfive_fiftyfour: { ... same as above },
                    fiftyfive_sixtyfour: { ... same as above },
                    sixtyfive_plus : {... same as above}
                    }
                },
                income: {
                    under_fifty: { 
                        my_location: float,
                        target_location: float,
                        growth: float
                    },
                    fifty_seventyfour: { ... same as above },
                    seventyfour_onetwentyfive: { ... same as above },
                    onetwentyfive_twohundred: { ... same as above },
                    twohundred_plus: { ... same as above}
                },
                ethnicity: {
                    white: {
                        my_location: float,
                        target_location: float,
                        growth: float
                    },
                    black: { ... same as above },
                    indian: { ... same as above },
                    asian: { ... same as above},
                    pacific_islander: { ... same as above },
                    other: { ... same as above }
                },
                education: {
                    some_highschool: {
                        my_location: float,
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
                        my_location: float,
                        target_location: float,
                        growth: float
                    },
                    female: { ... same as above }
                }
            },
            nearby: {
                relevant_locations: [
                    {
                        name: string,
                        rating: float,
                        number_rating: float,
                        distance: float,
                        lat: float,
                        lng: float
                    },
                    ... many more
                ],
                similar_locations: [
                    {
                        name: string,
                        rating: float,
                        number_rating: float,
                        distance: float,
                        lat: float,
                        lng: float
                    },
                    ... many more
                ],
            }
        }
    }

    """
    pass
