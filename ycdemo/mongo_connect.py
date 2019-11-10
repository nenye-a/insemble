from pymongo import MongoClient
import urllib

#### TODO: keep key secret by using environment variables


class Connect(object):
    @staticmethod
    def get_connection():
        mongo_uri = "DELETED_MONGODB_URL"
        return MongoClient(mongo_uri)