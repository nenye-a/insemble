# from .mongoconnect import Connect
import numpy as np

from pymongo import MongoClient
import urllib

# TODO: get the Connect MongoFile out of the classes 
#### TODO: keep key secret by using environment variables

class Connect(object):
    @staticmethod
    def get_connection():
        mongo_uri = "DELETED_MONGODB_URL"
        return MongoClient(mongo_uri)

class Retailer(object):
    """
    This method initializes a Retailer

    :param name: name of retail or restaurant establishment
    :type name: str, ex "Wendy's"
    :param place_type: the categories in which the establishment falls into
    :type place_type: set, set of strings. ex {"restaurant", "cafe", "middle_eastern"}
    :param price: a number indicating the price tier of the retailer
    :type price: float
    :param locations: all of the latitude longitude pairs of locations for the particular retailer
    :type locations: set, set of string tuples. ex {(33.5479999,-117.6711493), (33.54924617989272,-117.6698170201073)}

    """
    def __init__(self, name, place_type, price, locations):
        self.name = name
        self.place_type = place_type
        self.price = price
        self.locations = locations

    @staticmethod
    def get_retailers():
        return # TODO: return all available locations

    @staticmethod
    def get_retailer(_id):
        return # TODO: return a location object with the corresponding _id

    @staticmethod
    def put_retailer(name, place_type, price, locations):
        return # TODO: input or update an item in the data_base (return True or False)

    def copy(self):
        return Retailer(self.name, self.place_type, self.price, self.locations)

    def to_json(self):
        type_dict = {}
        for ptype in self.place_type:
            type_dict[ptype] = 1

        return {"name": self.name, "place_type": type_dict, "price": self.price, "locations": list(self.locations)}
