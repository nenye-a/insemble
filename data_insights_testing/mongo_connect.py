from pymongo import MongoClient
from decouple import config
import urllib

import os
#from django.conf import settings

#MONGO_USER = settings.MONGO_USER
#MONGO_PASS = settings.MONGO_DB_PASS
MONGO_USER = config("MONGO_USER")
MONGO_PASS = config("MONGO_DB_PASS")

class Connect(object):
    @staticmethod
    def get_connection():
        mongo_uri = "DELETED_MONGODB_URL"
        return MongoClient(mongo_uri)
