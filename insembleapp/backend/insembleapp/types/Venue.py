import sys
from django.conf import settings
sys.path.append(settings.INSIGHTS_DIR)

import numpy as np
from mongo_connect import Connect
import location_methods as lm
from bson.objectid import ObjectId


from .Retailer import Retailer

class Venue(object):

    client = Connect.get_connection()
    db_space = client.spaceData.dataset2
    db_venue = client.spaceData.venues

    RADIUS = 0.5

    # self, _id, name, lat, lng, address, census, pop, income, traffic, safety, nearby, radius,
    # place_type, price, locations, likes, ratings, photo_count, age, photo, icon):

    def __init__(self, _id, lat, lng, address, census, pop, income, traffic=None, safety=None, nearby=None, sqft = None,
                venue_age=None, has_retailer=False, current_retailer_tenure=None, retailer=None, likes=None, ratings=None,
                photo_count=None, photo=None, icon=None, owner_username=None, about_text=None, name=None):
        """

        :param _id:
        :param lat:
        :param lng:
        :param address:
        :param census:
        :param pop:
        :param income:
        :param traffic:
        :param safety:
        :param nearby:
        :param venue_age:
        :param has_retailer:
        :param current_retailer_tenure:
        :param retailer:
        :param likes:
        :param ratings:
        :param photo_count:
        :param photo:
        :param icon:
        :param owner_username:
        """

        # unique identifier
        self._id = _id

        # location specific indicators
        self.lat = lat
        self.lng = lng
        self.address = address
        self.census = census
        self.pop = pop
        self.income = income
        self.traffic = traffic
        self.safety = safety
        self.nearby = nearby
        self.venue_age = venue_age
        self.radius = Venue.RADIUS
        self.about_text = about_text
        self.sqft = sqft

        # link space to reatiler
        self.has_retailer = has_retailer
        self.current_retailer_tenure = current_retailer_tenure
        
        # retailer specific indicators
        self.retailer = retailer
        
        # name of the actual space (not of the retailer)
        self.name = name
        
        # space/retailer performance
        self.likes = likes
        self.ratings = ratings
        self.photo_count = photo_count
        self.photo = photo
        self.icon = icon

        # venue ownership
        self.owner_username = owner_username

    @staticmethod
    def get_venues(n=100, paired=False):
        '''
        Get locations that contain retailers, limited to n=100 items unless specified otherwise.
        '''
        if paired:
            db_venu_cursor = Venue.db_venue.aggregate([{"$match":{"has_retailer": "True"}},
                                                                    {"$sample": {"size": n}}])
        else:
            db_venue_cursor = Venue.db_venue.aggregate([{"$match":{"has_retailer": "False"}},
                                                                    {"$sample": {"size": n}}])

        locations = []
        for db_item in db_venue_cursor:
            locations.append(Venue.convert_db_item(db_item))

        return locations

    @staticmethod
    def get_venue(_id):
        
        db_item = Venue.db_venue.find_one({"_id": ObjectId(_id)})
        print(db_item)
        return Venue.convert_db_item(db_item)

    @staticmethod
    def get_matches(address=None, _id=None):

        try:
            if _id:
                db_item = Venue.db_venue.find_one({"_id": ObjectId(_id)})
                matches = lm.generate_location_matches(db_item["location"]["address"])
            else:
                matches = lm.generate_location_matches(address)
        except KeyError:
            raise KeyError

        matched_locations = []

        for db_item in matches:
            matched_locations.append(Venue.convert_db_item(db_item))

        return matched_locations
    

    # @staticmethod
    # def add_venue(**kwargs):
        
    #     # try:
    #     #     Venue.db_venue.insert(kwargs)
    #     # except:
    #     #     return False
    #     # return True

    @staticmethod
    def add_venue(address, owner_username, about_text=None, venue_age=None, photo=None, icon=None, name=None):

        temp, is_valid = lm.generate_location_profile(address, 0.5)
        if not is_valid:
            print("Unable to find location")
            return False

        # TODO: implement traffic
        # TODO: implement safety

        retailer = None

        document = {
            "address": temp.address,
            "lat": temp.lat,
            "lng": temp.lng,
            "census": temp.census,
            "pop": temp.pop,
            "traffic": None,
            "safety": None,
            "nearby": temp.nearby,
            "radius": Venue.RADIUS,
            "retailer": retailer,
            "has_Retailer": False,
            "photo": photo,
            "icon": icon,
            "about_text": about_text,
            "current_retailer_tenure": None,
            "venue_age": venue_age,
            "name": name,
            "owner_user": owner_username
        }

        try:
            Venue.db_venue.insert(document)
        except:
            return False
        return True

    @staticmethod
    def update_venue(_id, **kwargs):

        # TODO: check keyword content to make sure nothing incorrectly formatted gets placed in the database
        
        try:
            Venue.db_venue.update(
                {"_id":ObjectId(_id)},
                {"$set": kwargs}
            )
        except:
            return False
        return True

    ######
    ###### TODO: Delete Functions
    ######

    @staticmethod
    def convert_db_item(db_item):
        """
        Receives database item and converts it into venue location
        """
        
        _id = db_item["_id"]
        name = db_item["name"]
        lat = db_item["lat"]
        lng = db_item["lng"]
        census = db_item["census"]
        address = db_item["address"]
        pop = db_item["pop"]
        income = db_item["income"]
        nearby = db_item["nearby"]

        about_text = None
        if 'about_text' in db_item: about_text = db_item['about_text']

        venue_age= db_item["venue_age"]

        # TODO: implement traffic
        # TODO: implement safety

        # user field
        owner_username = None
        if 'owner_username' in db_item: owner_username = db_item['owner_username']

        has_retailer = None
        if 'has_retailer' not in db_item or db_item['has_retailer'] == 'False':
            return Venue(_id=_id, lat=lat, lng=lng, address=address, census=census, pop=pop, income=income,
                        nearby=nearby, owner_username=owner_username, venue_age=venue_age, name=name)
        
        current_retailer_tenure = db_item["current_retailer_age"]
        retailer = db_item["retailer"]
        
        likes = db_item["likes"]
        photo_count = db_item["photo_count"]

        ratings = db_item["ratings"]
        if np.isnan(ratings):
            ratings = None

        photo = db_item["photo"]
        icon = db_item["icon"]

        return Venue(_id=_id, lat=lat, lng=lng, address=address, census=census, pop=pop, income=income, nearby=nearby, 
                    has_retailer=True, current_retailer_tenure=current_retailer_tenure, retailer=retailer, likes=likes, 
                    ratings=ratings, photo_count=photo_count, photo=photo, icon=icon, owner_username=owner_username, name=name)

