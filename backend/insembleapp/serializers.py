from rest_framework import serializers

'''

This file contains all the serializers that will be used to validate the data received from any requests.
These serializers are primarily utilized by the "api.py" file which fields requests.

'''

# Tenant Match Serializer


class TenantMatchSerializer(serializers.Serializer):

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
    """

    address = serializers.CharField(required=False, max_length=300)
    brand_name = serializers.CharField(required=False, max_length=300)
    categories = serializers.ListField(required=False)
    income = serializers.JSONField(required=False)
    age = serializers.JSONField(required=False)
    personas = serializers.ListField(required=False)
    commute = serializers.ListField(required=False)
    education = serializers.ListField(required=False)
    rent = serializers.JSONField(required=False)

    # Validatator to ensure the rules mentioned above
    def validate(self, data):

        has_address = 'address' in data
        has_brand_name = 'brand_name' in data
        has_categories = 'categories' in data
        has_income = 'income' in data
        has_age = 'age' in data
        has_rent = 'rent' in data

        error_message = {}
        if not ((has_address and has_brand_name) or (has_categories and has_income)):
            error_message['status_detail'] = ["Please provide either (address and brand_name) or (categories and income)"]
        if has_income and 'min' not in data['income']:
            error_message['status_detail'] = error_message.get('status_detail', []) + ['min must be provided if income provided']
        if has_age and 'min' not in data['age']:
            error_message['status_detail'] = error_message.get('status_detail', []) + ['min must be provided if age provided']
        if has_rent and 'min' not in data['rent']:
            error_message['status_detail'] = error_message.get('status_detail', []) + ['min must be provided if rent provided']
        
        if len(error_message) > 0:
            error_message['status'] = 400
            raise serializers.ValidationError(error_message)
        else:
            return data
