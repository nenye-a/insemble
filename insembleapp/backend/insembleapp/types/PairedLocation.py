# import importlib
#
# importlib.import_module('data_insights')

import sys
from django.conf import settings

sys.path.append(settings.INSIGHTS_DIR)

import numpy as np
from pymongo import MongoClient
import urllib
import logging

from mongo_connect import Connect # ignore errors, works with Django run serfver
import location_methods as lm # ignore errors, works with Django run server

# code to connect to database if must be handled from here
# class Connect(object):
#     @staticmethod
#     def get_connection():
#         mongo_uri = "DELETED_MONGODB_URL"
#         return MongoClient(mongo_uri)

class PairedLocation(object):

    client = Connect.get_connection()
    db_space = client.spaceData

    def __init__(self, _id, name, lat, lng, address, census, pop, income, traffic, safety, nearby, radius,
                    place_type, price, locations, likes, ratings, photo_count, age, photo, icon):

        self._id = _id
        self.name = name

        self.lat = lat
        self.lng = lng
        self.address = address
        self.census = census
        self.pop = pop
        self.income = income
        self.traffic = traffic
        self.safety = safety
        self.nearby = nearby

        self.radius = radius

        self.place_type = place_type
        self.price = price
        self.locations = locations

        self.likes = likes
        self.ratings = ratings
        self.photo_count = photo_count
        self.age = age

        self.photo = photo
        self.icon = icon

    @staticmethod
    def get_paired_locations(n=100):
        '''
        Get all the available locations. Limnited to n=100 unless specified otherwise
        '''

        db_space_cursor = PairedLocation.db_space.dataset2.aggregate([{"$sample": {"size": n}}])

        paired_locations = []

        for db_item in db_space_cursor:

            _id = db_item["_id"]

            location = db_item["Location"]
            retailer = db_item["Retailer"]

            # get the location related fields imported
            lat = location["lat"]
            lng = location["lng"]
            census = location["census"]
            address = location["address"]
            pop = location["pop"]
            income = location["income"]
            nearby = location["nearby"]
            radius = location["radius"]

            # get the retailer related fields
            name = retailer["name"]
            price = retailer["price"]
            if np.isnan(price):
                price = 2  # flag that p doesn't exist
            locations = retailer["locations"]

            place_type = retailer["place_type"]

            # get other important information
            age =  db_item["age"]

            # get performance information
            likes = db_item["likes"]
            photo_count = db_item["photo_count"]

            ratings = db_item["ratings"]
            if np.isnan(ratings):
                ratings = None

            photo = db_item["photo"]
            icon = db_item["icon"]

            paired_locations.append(PairedLocation(_id, name, lat, lng, address, census, pop, income, None, None, nearby,
                                        radius, place_type, price, locations, likes, ratings, photo_count, age, photo, icon))

        return paired_locations

    @staticmethod
    def get_paired_location(_id):
        return # TODO: return a location object with the corresponding _id

    @staticmethod
    def get_matches(address):
        return lm.generate_location_matches(address)

    def to_json(self):
        return # TODO: actually return JSON version of Location retailer pair


if __name__ == '__main__':
    print(lm.generate_location_matches("Los Angeles"))
