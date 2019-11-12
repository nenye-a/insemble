from pymongo import MongoClient
import urllib

#### TODO: keep key secret by using environment variables

class Connect(object):
    @staticmethod
    def get_connection():
        mongo_uri = "mongodb+srv://nenye:" + urllib.parse.quote("helicop251") + "@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE"
        return MongoClient(mongo_uri)