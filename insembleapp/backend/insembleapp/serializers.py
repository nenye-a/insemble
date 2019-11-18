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
    floors = serializers.IntegerField()


# Retailer Serializer
class RetailerSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=100, required=True)
    place_type = serializers.JSONField()
    price = serializers.IntegerField(default=2)
    locations = serializers.JSONField()
    about_text = serializers.CharField(max_length=800)
    preferences = serializers.JSONField()
    requirements = serializers.JSONField()
    owner_username = serializers.CharField()
    photo = serializers.URLField()
    icon = serializers.URLField()     


# Serializer for venue combined objects
class VenueSerializer(serializers.Serializer):

    _id = serializers.CharField(allow_null=True)
    name = serializers.CharField(max_length=100)
    lat = serializers.FloatField()
    lng = serializers.FloatField()
    census = serializers.JSONField()
    address = serializers.CharField(required=True)
    pop = serializers.JSONField()
    income = serializers.FloatField()
    nearby = serializers.JSONField()
    radius = serializers.DecimalField(max_digits=3, decimal_places=2)
    price = serializers.IntegerField(default=2)
    likes = serializers.IntegerField()
    ratings = serializers.DecimalField(max_digits=3, decimal_places=2)
    photo_count = serializers.IntegerField()
    current_retailer_tenure = serializers.FloatField()
    retailer = serializers.CharField()
    photo = serializers.URLField()
    icon = serializers.URLField()
    traffic = serializers.JSONField(allow_null=True)
    safety = serializers.JSONField(allow_null=True)
    venue_age = serializers.FloatField()
    about_text = serializers.CharField(max_length=800)
    has_retailer = serializers.BooleanField(allow_null=True, default=False)
    owner_username = serializers.CharField(required=True)


# Serializer for location & retailer combined objects (Deprecated)
class PairedLocationSerializer(serializers.Serializer):

    _id = serializers.CharField()
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
    photo = serializers.URLField()
    icon = serializers.URLField()
    