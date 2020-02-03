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
        mongo_uri = "mongodb+srv://" + urllib.parse.quote(MONGO_USER) + ":" + urllib.parse.quote(
            MONGO_PASS) + "@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE"
        return MongoClient(mongo_uri)
