import sentry_sdk

import os
from decouple import Csv, config
from dj_database_url import parse as db_url
from sentry_sdk.integrations.django import DjangoIntegration

from .base import *  # noqa
import urllib


DEBUG = False

# SECRET_KEY = config('SECRET_KEY')
SECRET_KEY = os.environ['SECRET_KEY']

GOOG_KEY = os.environ['GOOG_KEY']
YELP_KEY= os.environ['YELP_KEY']
FRSQ_ID = os.environ['FRSQ_ID']
FRSQ_SECRET = os.environ['FRSQ_SECRET']
CRIME_KEY = os.environ['CRIME_KEY']
MONGO_KEY = os.environ['MONGO_KEY']
MONGO_DB_PASS = os.environ["MONGO_DB_PASS"]

DATABASES = {
    # 'default': config('DATABASE_URL', cast=db_url),
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'appbackend',
        # 'HOST': 'DELETED_MONGODB_URL