from rest_framework import serializers

'''

This file contains all the serializers that will be used to validate the data received from any requests.
These serializers are primarily utilized by the "tenant_api.py" file which fields requests.

'''


# Tenant Match Serializer
class TenantMatchSerializer(serializers.Serializer):

    """
    Parameters: {
        brand_name: string,             (required)
        address: string,                (required -> not required if categories are provided)
        categories: list[string],       (required -> not required if brand_name and address provided)
        income: {                       (required -> not required if brand_name and address provided)
            min: int,                   (required if income provided)
            max: int                    (optional)
        },
        age: {
            min: int,                   (optional)
            max: int                    (optional)
        },
        personas: list[string],         (optional)
        commute: list[string],          (optional)
        education: list[string],        (optional)
        ethnicity: list[string],        (optional)
        min_daytime_pop: int,           (optional)
        rent: {                         (optional)
            min: int,                   (required if rent provided)
            max: int                    (optional)
        },
        sqft: {                         (optional)
            min: int,                   (required if rent provided)
            max: int
        },
        frontage_width: int,            (optional)
        property_type: list[string]     (optional)
        match_id: string                (optional - only provide if wishing to update specific match)
    }

    """

    brand_name = serializers.CharField(max_length=300)
    address = serializers.CharField(required=False, max_length=300)
    categories = serializers.JSONField(required=False)
    income = serializers.JSONField(required=False)
    age = serializers.JSONField(required=False)
    personas = serializers.JSONField(required=False)
    commute = serializers.JSONField(required=False)
    education = serializers.JSONField(required=False)
    ethnicity = serializers.JSONField(required=False)
    min_daytime_pop = serializers.IntegerField(required=False)
    rent = serializers.JSONField(required=False)
    sqft = serializers.JSONField(required=False)
    frontage_width = serializers.IntegerField(required=False)
    property_type = serializers.JSONField(required=False)
    match_id = serializers.CharField(required=False, max_length=24)

    # Validatator to ensure the rules mentioned above
    def validate(self, data):

        has_address = 'address' in data
        has_categories = 'categories' in data
        has_income = 'income' in data
        has_age = 'age' in data
        has_rent = 'rent' in data
        has_sqft = 'sqft' in data

        error_message = {}
        if not (has_address or (has_categories and has_income)):
            error_message['status_detail'] = [
                "Please provide either address or (categories and income)"]
        if has_income and 'min' not in data['income']:
            error_message['status_detail'] = error_message.get(
                'status_detail', []) + ['min must be provided if income provided']
        if has_age and 'min' not in data['age']:
            error_message['status_detail'] = error_message.get(
                'status_detail', []) + ['min must be provided if age provided']
        if has_rent and 'min' not in data['rent']:
            error_message['status_detail'] = error_message.get(
                'status_detail', []) + ['min must be provided if rent provided']
        if has_sqft and 'min' not in data['sqft']:
            error_message['status_detail'] = error_message.get(
                'status_detail', []) + ['min must be provided if sqft provided']

        if len(error_message) > 0:
            error_message['status'] = 400
            raise serializers.ValidationError(error_message)
        else:
            return data


class LocationSerializer(serializers.Serializer):
    """

    parameters: {
        address: string,            (required)
        brand_name: string,         (required)
    }

    """

    address = serializers.CharField(required=True, max_length=300)
    brand_name = serializers.CharField(required=True, max_length=300)


class FastLocationDetailSerializer(serializers.Serializer):

    """
    Parameters:
        {
            match_id: string,                      (required)
            target_location: {                     (required if property_id is not provided)
                lat: int,                          (required if target_location provided)
                lng: int,                          (required if target_location provided)
            },
            property_id: string                    (required if target_location is not provided)
        }
    """

    match_id = serializers.CharField(required=True, max_length=24)
    target_location = serializers.JSONField(required=False)
    property_id = serializers.CharField(required=False, max_length=24)

    def validate(self, data):
        has_target_location = 'target_location' in data
        has_property_id = 'property_id' in data
        has_lat = has_target_location and 'lat' in data['target_location']
        has_lng = has_target_location and 'lng' in data['target_location']

        error_message = {}
        if not (has_property_id or has_target_location):
            error_message['status'] = 400
            error_message['status_detail'] = ["Please provide either a property_id or a target_location"]

        if not has_property_id and not (has_lat and has_lng):
            error_message['status'] = 400
            error_message['status_detail'] = ["Please provide lat and lng in the request"]
            raise serializers.ValidationError(error_message)

        if has_target_location:
            try:
                data['target_location']['lat'] = float(data['target_location']['lat'])
                data['target_location']['lng'] = float(data['target_location']['lng'])
            except Exception:
                error_message['status'] = 400
                error_message['status_detail'] = [
                    "Please make sure the latitude and longitude are either floats or string representations of floats"]
                raise serializers.ValidationError(error_message)

        return data


class LocationPreviewSerializer(serializers.Serializer):

    """
    parameters: {
        target_location: {                      (required if property_id is not provided)
            lat: int,                           (required if target_location provided)
            lng: int,                           (required if target_location provided)
        },
        property_id: string                     (required if target_location is not provided)
    }
    """

    target_location = serializers.JSONField(required=False)
    property_id = serializers.CharField(required=False, max_length=500)

    def validate(self, data):
        has_target_location = 'target_location' in data
        has_property_id = 'property_id' in data
        has_lat = has_target_location and 'lat' in data['target_location']
        has_lng = has_target_location and 'lng' in data['target_location']

        error_message = {}
        if not (has_property_id or has_target_location):
            error_message['status'] = 400
            error_message['status_detail'] = ["Please provide either a property_id or a target_location"]

        if not has_property_id and not (has_lat and has_lng):
            error_message['status'] = 400
            error_message['status_detail'] = ["Please provide lat and lng in the request"]
            raise serializers.ValidationError(error_message)

        if has_target_location:
            try:
                data['target_location']['lat'] = float(data['target_location']['lat'])
                data['target_location']['lng'] = float(data['target_location']['lng'])
            except Exception:
                error_message['status'] = 400
                error_message['status_detail'] = [
                    "Please make sure the latitude and longitude are either floats or string representations of floats"]
                raise serializers.ValidationError(error_message)

        return data
