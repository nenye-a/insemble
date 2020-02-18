from django.conf.urls import include, url  # noqa
from django.urls import path
from django.contrib import admin
from django.views.generic import TemplateView

import django_js_reverse.views

from rest_framework import routers
from .legacy_api import CategoryMapAPI, SearchAPI, MatchesAPI
from .tenant_api import TenantMatchAPI, FilterDetailAPI, LocationDetailsAPI

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^jsreverse/$', django_js_reverse.views.urls_js, name='js_reverse'),

    # send home page requests to react for accurate routing
    url(r'^$', TemplateView.as_view(
        template_name='insembleapp/index.html'), name='home'),
    # send non-backend specific routes to react for accurate routing
    url(r'^(?!%)(?!static)(?!fav)(?!admin)(?!accounts)(?!sock)(?!js)(?!api)(?:.*)/?$',
        TemplateView.as_view(template_name='insembleapp/index.html'), name='home'),

    # enable backend routes
    url(r'^', include(router.urls)),

    # TENANT API ROUTES
    url(r'api/tenantMatches/', TenantMatchAPI.as_view(), name='tenantMatch'),
    url(r'api/filter/', FilterDetailAPI.as_view(), name='filterDetail'),
    url(r'api/locationDetails/', LocationDetailsAPI.as_view(), name='locationDetails'),

    # LANDLORD API ROUTES

    # LEGACY API ROUTES
    # TODO: remove the legacy api calls
    url(r'api/category', CategoryMapAPI.as_view(), name='category'),
    url(r'api/search', SearchAPI.as_view(), name='search'),
    path(r'api/properties/<slug:_id>/', SearchAPI.as_view(), name='properties'),
    path(r'api/matches/<slug:address>', MatchesAPI.as_view(), name='matches'),
    # url(r'^', include('users.auth_urls')),
    url(r'^', include('feedback.feedback_urls'))
]
