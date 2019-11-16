from django.conf.urls import include, url  # noqa
from django.urls import include, path
from django.contrib import admin
from django.views.generic import TemplateView

import django_js_reverse.views

from rest_framework import routers, serializers, viewsets
from .api import PairedLocationViewSet # RetailerViewSet, LocationViewSet, 

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
# TODO: register location and retailer api once necessary
router.register(r'api/pair', PairedLocationViewSet, basename='pair')


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^jsreverse/$', django_js_reverse.views.urls_js, name='js_reverse'),

    # instantiate route that uses the correct index
    url(r'^$', TemplateView.as_view(template_name='insembleapp/index.html'), name='home'),

    # instantiate the other urls
    # url(r'^(?:.*)/?$', TemplateView.as_view(template_name='insembleapp/index.html'), name='home'),
    url(r'^(?!api)(?:.*)/?$', TemplateView.as_view(template_name='insembleapp/index.html'), name='home'),

    url(r'^', include(router.urls)),
    # path('', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
