from django.conf.urls import include, url  # noqa
from django.urls import include, path
from django.contrib import admin
from django.views.generic import TemplateView
from .api import RegisterAPI, LoginAPI, UserAPI
from knox import views as knox_views

urlpatterns= [
    url(r'api/auth', include('knox.urls')),
    url(r'api/auth/register', RegisterAPI.as_view(), name='register'),
    url(r'api/auth/login', LoginAPI.as_view(), name='login'),
    url(r'api/auth/user', UserAPI.as_view(), name='user'),
    url(r'api/auth/logut', knox_views.LoginView.as_view(), name='knox_logout')
]