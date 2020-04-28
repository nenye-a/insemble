from django.conf.urls import include, url  # noqa
from django.urls import path
from django.contrib import admin
from django.views.generic import TemplateView

import django_js_reverse.views

from rest_framework import routers
from .tenant_api import TenantMatchAPI, FilterDetailAPI, LocationPreviewAPI, AutoPopulateAPI, FastLocationDetailsAPI
from .landlord_api import PropertyTenantAPI, PropertyDetailsAPI, TenantDetailsAPI, PropertyAddressCheck

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
    path(r'api/tenantMatches/', TenantMatchAPI.as_view(), name='tenantMatch'),
    path(r'api/filter/', FilterDetailAPI.as_view(), name='filterDetail'),
    path(r'api/locationPreview/', LocationPreviewAPI.as_view(), name='locationPreview'),
    path(r'api/autoPopulate/', AutoPopulateAPI.as_view(), name="autoPopulate"),
    path(r'api/fastLocationDetails/', FastLocationDetailsAPI.as_view(), name="fastLocationDetails"),

    # LANDLORD API ROUTES
    path(r'api/propertyTenants/', PropertyTenantAPI.as_view(), name='propertyTenants'),
    path(r'api/propertyTenants/<slug:property_id>', PropertyTenantAPI.as_view(), name='propertyTenants'),
    path(r'api/propertyTenants/<slug:property_id>/<slug:space_id>', PropertyTenantAPI.as_view(), name='propertyTenants'),
    path(r'api/propertyDetails/', PropertyDetailsAPI.as_view(), name='PropertyDetails'),
    path(r'api/tenantDetails/', TenantDetailsAPI.as_view(), name='TenantDetails'),
    path(r'api/propertyCheck/<slug:address>', PropertyAddressCheck.as_view(), name='propertyCheck')
]
