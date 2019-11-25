from django.conf.urls import include, url  # noqa
from django.urls import include, path
from django.contrib import admin
from django.views.generic import TemplateView

import django_js_reverse.views

from rest_framework import routers, serializers, viewsets
from .api import *
from users.views import DangerousLoginView

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'api/pair', PairedLocationViewSet, basename='pair')
router.register(r'api/tmatches', TenantMatchesViewSet, basename='tmatches')
router.register(r'api/lmatches', SpaceMatchesViewSet, 'lmatches')
router.register(r'api/venue', VenueViewSet, basename='venue')
router.register(r'api/retailer', RetailerViewSet, basename='retailer')
router.register(r'api/location', LocationInfoViewSet, basename="location")

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^jsreverse/$', django_js_reverse.views.urls_js, name='js_reverse'),
    
    # send home page requests to react for accurate routing
    url(r'^$', TemplateView.as_view(template_name='insembleapp/index.html'), name='home'),
    # send non-backend specific routes to react for accurate routing
    url(r'^(?!%)(?!static)(?!fav)(?!admin)(?!accounts)(?!sock)(?!js)(?!api)(?:.*)/?$', 
                TemplateView.as_view(template_name='insembleapp/index.html'), name='home'),
    # enable bakend routes
    url(r'^', include(router.urls)),
    url(r'api/map', CategoryMapAPI.as_view(), name='map'),
    url(r'^', include('users.auth_urls'))
    
]
