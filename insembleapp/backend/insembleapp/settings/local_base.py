from .base import *  # noqa
from pymongo import MongoClient
import urllib


DEBUG = True

HOST = 'http://localhost:8000'

SECRET_KEY = 'secret'

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'appbackend',
        'HOST': 'DELETED_MONGODB_URL