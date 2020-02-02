from rest_framework import serializers
from .models import Feedback
from django.contrib.auth import authenticate

# Serializer for storing feedback
class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
        fields = "__all__"




