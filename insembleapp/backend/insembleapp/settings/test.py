from .base import *  # noqa
import urllib


SECRET_KEY = 'test'

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'appbackend',
        'HOST': 'DELETED_MONGODB_URL