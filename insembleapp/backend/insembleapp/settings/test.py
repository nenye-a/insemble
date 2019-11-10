from .base import *  # noqa
import urllib


SECRET_KEY = 'test'

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'mongoconnect',
        'HOST': 'DELETED_MONGODB_URL