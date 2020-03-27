from rest_framework import serializers


class PropertyTenantSerializer(serializers.Serializer):

    """

    parameters: {
        # Property related fields
        property_id: string                 (required -> not required if address and property type are added)       
        address: string,                    (required -> not required if property_id is provided)
        property_type: list[string],        (required -> not required if property_id is provided)
        logo: string (url),                 (ignored if property_id provided)
        owning_organization: string,        (ignored if property_id provided)
        target_categories: list[string],    (ignored if property_id provided)
        exclusives: list[string],           (ignored if property_id provided)

        # Space related fields
        space_id
        space_condition: list[string],
        tenant_type: list[string],
        asking_rent: int,
        sqft: int,
        divisible: boolean,
        divisible_sqft: list[int],
        pro: boolean,
        visible: boolean,
        media: {                           # NOTE: might be removed due to redundancy
            photos: {
                main: url_string,
                other: list[url_string]
            },
            tour: url_string (matterport)
        }
    }


    """

    property_id = serializers.CharField(max_length=24, required=False)
    space_id = serializers.CharField(max_length=24, required=False)
    address = serializers.CharField(max_length=300, required=False)
    property_type = serializers.JSONField(required=False)
    logo = serializers.CharField(max_length=500, required=False)
    owning_organization = serializers.CharField(max_length=500, required=False)
    target_categories = serializers.JSONField(required=False)
    exclusives = serializers.JSONField(required=False)
    sqft = serializers.IntegerField(required=False)
    tenant_type = serializers.JSONField(required=False)
    space_condition = serializers.JSONField(required=False)
    asking_rent = serializers.IntegerField(required=False)
    divisible = serializers.BooleanField(required=False)
    divisible_sqft: serializers.JSONField(required=False)
    pro = serializers.BooleanField(required=False)
    visible = serializers.BooleanField(required=False)
    media = serializers.JSONField(required=False)

    def validate(self, data):

        has_property_id = 'property_id' in data
        has_address = 'address' in data
        has_property_type = 'property_type' in data
        has_space_id = 'space_id' in data
        has_sqft = 'sqft' in data
        has_tenant_type = 'tenant_type' in data

        error_message = {}
        if not (has_property_id or (has_address and has_property_type)):
            error_message['status'] = 400
            error_message['status_detail'] = error_message.get('status_detail', []).append(
                "Please provide either property_id or (address and property_type)"
            )

        if not (has_space_id or (has_sqft and has_tenant_type)):
            error_message['status_detail'] = error_message.get('status_detail', []).append(
                "Please provide either space_id or (sqft and tenant_type)"
            )

        if len(error_message) > 0:
            raise serializers.ValidationError(error_message)

        return data


class PropertyDetailsSerializer(serializers.Serializer):
    property_id = serializers.CharField(max_length=24)


class PropertyCheckSerializer(serializers.Serializer):
    address = serializers.CharField(max_length=240)


class TenantDetailsSerializer(serializers.Serializer):

    brand_id = serializers.CharField(max_length=24)
    property_id = serializers.CharField(max_length=24)
    match_id = serializers.CharField(max_length=24, required=False)
