
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin

from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from knox.models import AuthToken

from .serializers import *
from users.models import User
from users.serializers import UserSerializer


# Register API
class RegisterAPI(generics.GenericAPIView):
    
    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]
    
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, 
            context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

# Login API
class LoginAPI(generics.GenericAPIView):
    
    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]
    
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, 
            context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

# User API
class UserAPI(generics.RetrieveAPIView):
    
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

    
#User view
class UserViewSet(viewsets.ModelViewSet):

    login_url = '/login'
    redirect_field_name = 'login'
    
    """
    A simple ViewSet for listing or retrieving users.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

