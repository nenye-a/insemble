from rest_framework import serializers


class PropertyTenantSerializer(serializers.Serializer):

    """

    parameters: {
        address: string,                   (required)
        space_type: list[string],          
        tenant_type: list[string],
        sqft: int,
        asking_rent: int,
        target_categories: list[string],
        exclusives: list[string]  
    }

    """

    address = serializers.CharField(required=True, max_length=300)
    sqft = serializers.IntegerField()
    space_type = serializers.ListField(child=serializers.CharField(), required=False)
    asking_rent = serializers.IntegerField(required=False)
    tenant_type = serializers.ListField(child=serializers.CharField(), required=False)
    target_categories = serializers.ListField(child=serializers.CharField(), required=False)
    exclusives = serializers.ListField(child=serializers.CharField(), required=False)
