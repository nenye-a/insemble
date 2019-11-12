from rest_framework import serializers


# Location Serializer
class LocationSerializer(serializers.Serializer):

    address = serializers.CharField(max_length=100, required=True)
    lat = serializers.FloatField(required=True)
    lng = serializers.FloatField(required=True)
    census = serializers.JSONField()
    pop = serializers.JSONField()
    income = serializers.FloatField()
    traffic = None
    safety = None
    nearby = serializers.JSONField()
    radius = serializers.DecimalField(max_digits=3, decimal_places=2)
    sqf = serializers.IntegerField()
    floors = serializers.IntegerField

# Retailer Serializer
class RetailerSerializer(serializers.Serializer):
    
    name = serializers.CharField(max_length=100, required=True)
    place_type = serializers.JSONField()
    price = serializers.IntegerField(default=2)
    locations = serializers.JSONField()

# Serializer for location & retailer combined objects
class PairedLocationSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=100, required=True)
    lat = serializers.FloatField()
    lng = serializers.FloatField()
    census = serializers.JSONField()
    address = serializers.CharField()
    pop = serializers.JSONField()
    income = serializers.FloatField()
    nearby = serializers.JSONField()
    radius = serializers.DecimalField(max_digits=3, decimal_places=2)
    price = serializers.IntegerField(default=2)
    locations = serializers.JSONField()
    place_type = serializers.JSONField()
    likes = serializers.IntegerField()
    ratings = serializers.DecimalField(max_digits=3, decimal_places=2)
    photo_count = serializers.IntegerField()
    age = serializers.FloatField()
