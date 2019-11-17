import sys
from django.conf import settings
sys.path.append(settings.INSIGHTS_DIR)

from mongo_connect import Connect
import location_methods as lm
import location_builder as lb
from bson.objectid import ObjectId

class Retailer(object):

    client = Connect.get_connection()
    db_retailer = client.spaceData.retailers

    DEFAULT_PRICE = 2

    def __init__(self, name, place_type, price=DEFAULT_PRICE, locations=None, about_text=None, photo=None, icon=None,
                 preferences=None, requirements=None, owner_username=None, _id=None):
        
        self._id=_id
        self.name = name
        self.place_type = place_type
        self.price = price
        self.locations = locations
        self.about_text = about_text
        self.preferences = preferences
        self.requirements = requirements

        self.owner_username = owner_username

        self.photo = photo
        self.icon = icon        

    @staticmethod
    def get_retailers(n=100):
        
        db_retailer_cursor = Retailer.db_retailer.aggregate([{"$sample": {"size": n}}])

        retailers = []
        for db_item in db_retailer_cursor:
            retailers.append(Retailer.convert_db_item(db_item))
        return retailers
    
    @staticmethod
    def get_retailer(_id):
        
        db_item = Retailer.db_retailer.find_one({"_id": ObjectId(_id)})
        return Retailer.convert_db_item(db_item)

    @staticmethod
    def add_retailer(name, location, owner_username, about_text=None, preferences=None, requirements=None, 
                     photo=None, icon=None):
        
        temp, is_valid = lb.generate_retailer_profile(name, location)
        if not is_valid:
            print("Retailer creation unsuccessful")
            return False
        
        # Retailer(name, types, price, locations), retailer_valid
        retailer = {
            "name": temp.name,
            "place_type": temp.place_type,
            "price": temp.price,
            "locations": temp.locations,
            "about_text": about_text,
            "preferences": preferences,
            "requirements": requirements,
            "owner_username": owner_username,
            "photo": photo,
            "icon": icon
        }
        
        try:
            Retailer.db_retailer.insert(retailer)
        except:
            return False
        return True

    @staticmethod
    def update_retailer(_id, **kwargs):
        
        # TODO: check keyword content to make sure nothing incorrectly formatted gets placed in the database
        
        try:
            Retailer.db_retailer.update(
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
        
        # TODO: set up the database

        _id = db_item["_id"]
        name = db_item["name"]
        place_type = db_item["place_type"]
        price = db_item["price"]
        locations = db_item["locations"] # TODO: convert locations to list of ids in database (not lat, lng)
        about_text = db_item["about_text"]
        preferences = db_item["preferences"]
        requirements = db_item["requirements"]
        owner_username = db_item["owner_username"]
        photo = db_item["photo"]
        icon = db_item["icon"]
        
        return Retailer(_id, name, place_type, price=price, locations=locations, about_text=about_text, photo=photo,
                        icon=icon, preferences=preferences, requirements=requirements, owner_username=owner_username)