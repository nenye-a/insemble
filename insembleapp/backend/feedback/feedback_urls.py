from django.conf.urls import include, url  # noqa
from .api import FeedbackAPI

urlpatterns = [
    url(r'api/feedback', FeedbackAPI.as_view(), name='feedback')
]
