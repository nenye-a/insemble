from rest_framework import serializers

'''

This file contains all the serializers that will be used to validate the data received from any requests.
These serializers are primarily utilized by the "api.py" file which fields requests.

'''

# Tenant Match Serializer


class TenantMatchSerializer(serializers.Serializer):

    address = serializers.CharField(required=True, max_length=250)
