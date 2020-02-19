from rest_framework import status, generics, permissions
from .tenant_api import AsynchronousAPI
from rest_framework.response import Response
from .landlord_serializers import PropertyTenantSerializer
import data.matching as matching
import json


'''

This file contains the landlord api interface for the matching algorithm.
The endpoints to access this interface is presented in the "urls.py"
file.

'''


# TODO: implement api functions for the landlord api
# PropertyMatchApi - referenced by api/propertyTenants/
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

        # TODO: Create the database structure to host this information. Will return to this after learning
        # more about how we are going to host this information.

        # Tier 1 tenants
        # TODO: pull list of tenants that have indicated interest in this location (includes match values)
        # Pending understanding of how tenants are stored in prisma

        # Tier 2 & Tier 3 tenants
        # TODO: query the tenant database (or some preprocessed-list of tenants)
        # TODO: generate list of tenants in the database + their match values
        # Pending understanding of how tenants are stored in prisma (will likely just link through foreign key)

        pass
