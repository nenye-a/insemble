from rest_framework import serializers


class PropertyTenantSerializer(serializers.Serializer):

    """

    parameters: {
        address: string,                    (required)
        property_type: list[string],        (required)        
        space_type: list[string],           (required)
        tenant_type: list[string],          
        sqft: int,
        asking_rent: int,
        target_categories: list[string],
        exclusives: list[string]
    }

    """

    property_id = serializers.CharField(max_length=12, required=False)
    address = serializers.CharField(max_length=300, required=False)
    property_type = serializers.JSONField(required=False)
    space_type = serializers.JSONField(required=False)
    tenant_type = serializers.JSONField(required=False)
    sqft = serializers.IntegerField(required=False)
    asking_rent = serializers.IntegerField(required=False)
    space_type = serializers.JSONField(required=False)
    target_categories = serializers.JSONField(required=False)
    exclusives = serializers.JSONField(required=False)
