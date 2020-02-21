from rest_framework import status, generics, permissions
from .tenant_api import AsynchronousAPI
from rest_framework.response import Response
from .landlord_serializers import PropertyTenantSerializer
import data.landlord_matching as landlord_matching
import data.landlord_provider as landlord_provider
import json


'''

This file contains the landlord api interface for the matching algorithm.
The endpoints to access this interface is presented in the "urls.py"
file.

'''


# TODO: implement api functions for the landlord api
# PropertyTenantApi - referenced by api/propertyTenants/
class PropertyTenantAPI(AsynchronousAPI):

    """

    This api endpoint will be used to populate the tenants that a landlord sees when they access the platform. There will be a variety of different tenants.

    - Tenants interested in the landlords property.           -> (details known, and interest indicated)
    - Tenants present on the platform, but not interested.    -> (details known, but interest not indicated)
    - Tenants not present on the platform.                    -> (details unknown, but can be approximated)

    These different stages will serve as tiers, and each tier will be ranked by match to the landlord's location and property. If someone not on the platform
    gets on the platform, there will need to be a way for them to claim their account.

    parameters: {
        address: string,                   (required)
        space_type: list[string],
        tenant_type: list[string],
        sqft: int,
        asking_rent: int,
        target_categories: list[string],
        exclusives: list[string]
    }

    response: {
        status: int (HTTP),
        status_detail: string or list,
        tenants: [
            {
                tenant_id: string,
                picture_url: url,
                name: string,
                category: string,
                num_existing_locations: int,
                match_value: int,
                interested: boolean,
                on_platform: boolean,
                matches_tenant_type: boolean
            }
            ... many more
        ]
    }

    """

    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = PropertyTenantSerializer

    def get(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_params = serializer.validated_data

        # TODO: implement function that will grab all the interested tenants. Tenants can only indicate interest
        # by reaching out to the landlord. This is pending storage of "connected" or messaging tenants. For these
        # tenants we should have already pre-processed their match (from tenant side), and only need to display
        # them.
        interested_tenants = []

        # TODO: Generate remaining matches (implement the landlord side generated matches)
        matches = landlord_provider.get_matching_tenants(
            validated_params['address'],
            validated_params['sqft'],
            # validated_params['rent'],
            # validated_params['tenant_type'],
            # validated_params['exclusives']
        )
        matches = json.loads(matches) if not matches == [] else []

        # TODO: either processed into desired form, or receive in desired form.
        tenants = interested_tenants + matches

        response = {
            'status': status.HTTP_200_OK,
            'status_detail': "Success",
            'tenants': tenants
        }

        return Response(response, status=status.HTTP_200_OK)
