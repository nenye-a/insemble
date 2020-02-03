from django.conf import settings
from pymongo import MongoClient
import urllib

'''

Connection file to access mongodb.

'''

MONGO_USER = settings.MONGO_USER
MONGO_PASS = settings.MONGO_DB_PASS


class Connect(object):
    @staticmethod
    def get_connection():
        mongo_uri = "DELETED_MONGODB_URL"
        return MongoClient(mongo_uri)
