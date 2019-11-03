from pymongo import MongoClient
import urllib

class Connect(object):
    @staticmethod
    def get_connection():
        # return MongoClient("mongodb+srv://nenye:helicop251@cluster0-c2jyp.mongodb.net/test?retryWrites=true")
        mongo_uri = "mongodb+srv://nenye:" + urllib.parse.quote("helicop251") + "@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE"
        # return MongoClient("mongodb+srv://nenye:helicop251@cluster0-c2jyp.mongodb.net/test?retryWrites=true")
        print(mongo_uri)
        return MongoClient(mongo_uri)