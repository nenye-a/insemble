from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        # fields = ('id', 'first_name', 'last_name', 'email', 'company')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'company')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data['email'], first_name=validated_data['first_name'], 
                        password=validated_data['password'], last_name=validated_data['last_name'], 
                        company=validated_data['company'])

        return user

# Login Serializer

class LoginSerializer(serializers.Serializer):
    
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorret Credentials")


