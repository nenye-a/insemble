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
    space_type = serializers.ListField(child=serializers.CharField())
    tenant_type = serializers.ListField(child=serializers.CharField())
    space_type = serializers.ListField(child=serializers.CharField())
    sqft = serializers.IntegerField()
    asking_rent = serializers.IntegerField()
    target_categories = serializers.ListField(child=serializers.CharField())
    exclusives = serializers.ListField(child=serializers.CharField())
