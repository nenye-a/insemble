from .base import *  # noqa
from pymongo import MongoClient
import urllib


DEBUG = True

HOST = 'http://localhost:8000'

SECRET_KEY = 'secret'

GOOG_KEY = config('GOOG_KEY')
YELP_KEY= config('YELP_KEY')
FRSQ_ID = config('FRSQ_ID')
FRSQ_SECRET = config('FRSQ_SECRET')
CRIME_KEY = config('CRIME_KEY')
MONGO_KEY = config('MONGO_KEY')
MONGO_DB_PASS = config("MONGO_DB_PASS")

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'appbackend',
        'HOST': 'DELETED_MONGODB_URL