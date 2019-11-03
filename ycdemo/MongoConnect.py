from pymongo import MongoClient
import urllib

class Connect(object):
    @staticmethod
    def get_connection():
        # return MongoClient("DELETED_MONGODB_URL"
        # return MongoClient("mongodb+srv://nenye:DELETED_EMAIL/test?DELETED_RETRY_WRITES")
        print(mongo_uri)
        return MongoClient(mongo_uri)