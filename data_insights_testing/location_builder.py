import sys
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR,'data_aggregator'))  # include data_agregator in path
import json
import time
import numpy as np
import pandas as pd
import urllib.parse
from Location import Location
from Retailer import Retailer
from smart_search import *
from decouple import config
import geopy.distance
import spatial
import arcgis
import environics

#from django.conf import settings

#### TODO: keep secret by using environment variables
#### TODO: consolidate APIs (to use fewer if possible)

#please don't share
GOOG_KEY = config('GOOG_KEY')
YELP_KEY= config('YELP_KEY')
FRSQ_ID = config('FRSQ_ID')
FRSQ_SECRET = config('FRSQ_SECRET')
CRIME_KEY = config('CRIME_KEY')
#MONGO_KEY = config('MONGO_KEY')


#GOOG_KEY = settings.GOOG_KEY
#YELP_KEY= settings.YELP_KEY
#FRSQ_ID = settings.FRSQ_ID
#FRSQ_SECRET = settings.FRSQ_SECRET
#CRIME_KEY = settings.CRIME_KEY

MILES_TO_M = 1609.34

'''
This method takes in a text query, such as a retailer name, address, or city, and generates a location from it. 

:param input: query to search
:type input: string, ex: "soulva hayes st"
:return:  (latitude, longitude, result valid) for the queried location, along with boolean indicating a successful search
:rtype: tuple (Float, Float, Boolean), ex: (33.5479999,-117.6711493, True)
'''
def get_loc_from_input(input):
    ####
    #### TODO: error checking to find the right locations/retailer names
    ####
    result_valid = True

    # parse string address for something readable by google
    format_input = urllib.parse.quote(input)
    URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
        format_input, GOOG_KEY)

    # search for location
    data = smart_search(URL, 'google', 'findplacefromtext')

    # get lat, lng pairs and give invalid result if nonexistant for input
    try:
        lat = data["candidates"][0]["geometry"]["location"]["lat"]
        lng = data["candidates"][0]["geometry"]["location"]["lng"]
    except Exception:
        print("Error getting location from input {0}".format(input))
        print(data)
        lat = np.nan
        lng = np.nan
        result_valid = False

    return lat, lng, result_valid

def get_address_from_loc(lat, lng):
    URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location={},{}&rankby=distance&type=establishment&key={}".format(lat,lng,
        GOOG_KEY)
    result_valid = True
    data = smart_search(URL, 'google', 'nearbysearch')

    try:
        address = data['results'][0]['vicinity']
        print(address)
    except Exception:
        print("Error getting address from input lat: {}, lng: {}".format(lat, lng))
        print(data)
        address = np.nan
        result_valid = False
        return address, result_valid

    my_geo, item_geo = (data['results'][0]['geometry']['location']['lat'], data['results'][0]['geometry']['location']['lng']), (lat, lng)
    meter_distance = geopy.distance.distance(my_geo, item_geo).meters
    acceptable_meters = 100

    if meter_distance > acceptable_meters:
        print("Error: nearby address too far from input lat: {}, lng: {}".format(lat, lng))
        result_valid = False
        return np.nan, result_valid

    return address, result_valid


def get_demographics(lat, lng, radius, count=0):
    result_valid = True

    #### FIXME: move sGeo to constant at top of code
    # search demographics from justice map
    sGeo = "tract"
    URL = "http://www.spatialjusticetest.org/api.php?fLat={0}&fLon={1}&sGeo={2}&fRadius={3}".format(lat,lng,sGeo,radius)
    data = smart_search(URL, 'justicemap', 'normal')

    try:
        census = {"asian":float(data["asian"]), "black":float(data["black"]), "hispanic":float(data["hispanic"]),
              "indian":float(data["indian"]), "multi":float(data["multi"]), "white":float(data["white"])}
        pop = int(data["pop"])
        income = float(data["income"])

    # if no demographic results, expand the radius by .1 mi until demographic results obtained or timeout at 4 tries
    except Exception:
        if count <= 4:
            radius += .1
            count += 1
            return get_demographics(lat, lng, radius, count)

        print("Error getting demographics from lat {0} and lng {1}".format(lat, lng))
        census = np.nan
        pop = np.nan
        income = np.nan
        result_valid = False

    return census, pop, income, radius, result_valid

def get_nearby_stores(lat, lng, radius):
    result_valid = True
    ####
    #### TODO: need to incorporate proximity (closer stores... more influence)

    nearby = {}
    #### TODO: ensure right retailer

    # search for nearby stores in radius
    url_search = 'https://api.foursquare.com/v2/venues/search'
    params = dict(
        client_id=FRSQ_ID,
        client_secret=FRSQ_SECRET,
        v='20191028',
        ll=str(lat) + "," + str(lng),
        intent='browse',
        radius=radius*MILES_TO_M
    )
    data = smart_search(url_search, 'foursquare', 'venues_search', params=params)

    # check to make sure categories field is present
    try:
        data['response']['venues'][0]['categories']
    except Exception:
        print("Error getting Foursquare retail categories from {0}, {1} with radius {2}".format(lat, lng, radius))
        result_valid = False
        return np.nan, result_valid

    # add categories of nearby venues to dictionary counter to keep track
    for venue in data['response']['venues']:
        for cat in venue["categories"]:
            try:
                nearby[cat["name"]] = nearby[cat["name"]] + 1
            except Exception:
                nearby[cat["name"]] = 1

    return nearby, result_valid

'''
This method creates a location profile for a particular address. It pulls in information from various APIs to create Locations

:param address: street address of establishment
:type address: string
:param radius: radius(mi) to use for surrounding influence drivers
:type radius: float
:return: Location object with demographic and local details. Boolean indicating whether the data is good
:rtype: Tuple (Location, Boolean)
'''
def generate_location_profile(address, radius):

    def get_footraffic(address):
        ####
        #### TODO: plug in with specific location and get foot traffic (geolocation data)
        ####

        pass

    def get_safety(lat,lng):
        ####
        #### TODO: find other crime API, or find incident correlations to store success, potentially analyze raw incidents by proximity still using Crimometer
        ####
        "https://private-anon-79b1042c48-crimeometer.apiary-mock.com/v1/incidents/stats?lat=lat&lon=lon&distance=distance&datetime_ini=datetime_ini&datetime_end=datetime_end,&source=source"

        URL = "https://api.crimeometer.com/v1/incidents/raw-data?lat={0}&lon={1}&distance={2}&datetime_ini={3}&datetime_end={4}".format(lat, lng, radius+"m", start, end)
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': CRIME_KEY
        }
        data = smart_search(URL, 'crimeometer', 'normal', headers=headers)

        pass

    lat, lng, valid = get_loc_from_input(address)

    if not valid:
        return None, valid

    census, pop, income, census_radius, valid2 = get_demographics(lat, lng, radius)
    nearby, valid3 = get_nearby_stores(lat, lng, radius)
    ####
    #### TODO: reorganize locations inputs without traffic & remove field from dataset. incorporate safety
    ####

    if valid and valid2 and valid3:
        location_valid = True
    else:
        location_valid = False

    #return Location object
    return Location(address, lat, lng, census, pop, income, None, None, nearby, census_radius), location_valid

# 1/29/20 dl
def generate_location_profile_new(address):

    # get lat long 
    lat, lng, valid = get_loc_from_input(address)

    if not valid:
        return None, valid

    # get data 
    cats, spatial_df = spatial.create_spatial_cats_and_df()
    block_df = spatial.create_block_grp_df()
    psycho_dict = spatial.get_psychographics(
                lat, lng, 1, spatial_df, block_df, cats)

    arcgis_dict = arcgis.details(lat, lng, 1)

    cats, demo_df = environics.create_demo_cats_and_df()
    demo_dict = environics.get_demographics(
                lat, lng, 1, demo_df, block_df, cats)

    # create arr as df 
    # psycho
    psycho_df = pd.DataFrame([psycho_dict], columns=psycho_dict.keys())

    # arcgis - num households, daytime pop, daytime working pop, income  
    arcgis_df = pd.DataFrame([arcgis_dict], columns=arcgis_dict.keys())
    arcgis_df = arcgis_df.drop(columns=["HouseholdGrowth2017-2022", "DaytimeResidentPop"])
    num_households_df = arcgis_df["TotalHouseholds"]
    daytime_pop_df = arcgis_df["DaytimePop"]
    daytime_working_pop_df = arcgis_df["DaytimeWorkingPop"]
    income_df = arcgis_df["MedHouseholdIncome"]

    # demo - gender, race, age, travel time, transport methods 
    gender_dict = demo_dict["Current Year Population, Gender"]
    gender_df = pd.DataFrame([gender_dict], columns=gender_dict.keys())
    race_dict = demo_dict["Current Year Population, Race"]
    race_df = pd.DataFrame([race_dict], columns=race_dict.keys())
    age_dict = demo_dict["Current Year Population, Age"]
    age_df = pd.DataFrame([age_dict], columns=age_dict.keys())
    transport_dict = demo_dict["Current Year Workers, Transportation to Work"]
    transport_df = pd.DataFrame([transport_dict], columns=transport_dict.keys())
    travel_time_dict = demo_dict["Current Year Workers, Travel Time To Work"]
    travel_time_df = pd.DataFrame([travel_time_dict], columns=travel_time_dict.keys())

    #demo_dict = {}
    #demo_dict.update(gender_dict)
    #demo_dict.update(race_dict)
    #demo_dict.update(age_dict)
    #demo_dict.update(transport_dict)
    #demo_dict.update(travel_time_dict)
    #demo_df = pd.DataFrame([demo_dict], columns=demo_dict.keys())

    # create final df 
    df = pd.concat([psycho_df, num_households_df, daytime_pop_df, daytime_working_pop_df, income_df, gender_df, race_df, age_df, transport_df, travel_time_df], axis=1)
    return df

'''
This method creates a retailer profile for a particular retailer. It pulls in information from various APIs to create Retailers

:param name: Retailer name 
:type name: string
:param location: additional location information to narrow down a particular retailer
:type location: string, ex: "California" 
:return Retailer: Retailer object with store details
:rtype: Retailer
'''
def generate_retailer_profile(name, location):
    def get_locations(name, location):
        result_valid = True

        ####
        #### TODO: make location param optional (for places with locations spanning multiple states)
        #### TODO: check if all locations pulled are indeed that retailer
        ####
        input = name+" "+location

        # parse string address for something readable by google. search
        format_input = urllib.parse.quote(input)
        URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query={0}&key={1}".format(format_input, GOOG_KEY)
        data = smart_search(URL, 'google', 'textsearch')

        # add all retailer locations from search return to set
        locations = set()
        ####
        #### FIXME: adjust repetitive calls to the same blocks of code. merge to one function
        ####
        for result in data['results']:
            try:
                lat, lng = result['geometry']['location']['lat'], result['geometry']['location']['lng']
                locations.add((lat, lng))
            except Exception:
                print("Error getting retail locations from name {0} and location {1}. Not adding.".format(name, location))
                print(data)

        # if additional pages exist, continue searching on next pages for retailer locations
        more_pages = True
        while more_pages:
            try:
                page_token = data['next_page_token']
                URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query={0}&key={1}&pagetoken={2}".format(input, GOOG_KEY, page_token)
                data = repeat_search(URL, "google", "textsearch")

                for result in data['results']:
                    try:
                        lat, lng = result['geometry']['location']['lat'], result['geometry']['location']['lng']
                        locations.add((lat, lng))
                    except Exception:
                        print("Error getting retail locations from name {0} and location {1}. Not adding.".format(name, location))
                        print(data)

            except Exception:
                more_pages = False

            if len(locations) == 0:
                result_valid = False
        return locations, result_valid

    def get_placedetails(name, location):
        result_valid = True
        input = name + " " + location

        #### TODO: may want to aggregate types over all locations
        lat, lng, valid = get_loc_from_input(input)
        if not valid:
            return None, None, False

        #### TODO: ensure right retailer
        ####TODO: fix v and implement database updates

        # search for a particular retailer at location
        types = set()
        url_search = 'https://api.foursquare.com/v2/venues/search'
        params = dict(
            client_id=FRSQ_ID,
            client_secret=FRSQ_SECRET,
            v='20191028',
            query=name,
            ll=str(lat) + "," + str(lng),
            intent='checkin',
        )
        data = smart_search(url_search, 'foursquare', 'venues_search', params=params)

        try:
            id = data['response']['venues'][0]['id']
        except Exception:
            print("Error getting id on Foursquare from name {0}, lat {1} and lng {2}".format(name, lat, lng))
            print(data)
            return np.nan, np.nan, False

        # use venue id to search details about a retailer
        url_stats = 'https://api.foursquare.com/v2/venues/{0}'.format(id)
        params = dict(
            client_id=FRSQ_ID,
            client_secret=FRSQ_SECRET,
            v='20191028'
        )
        data = smart_search(url_stats, 'foursquare', 'venue_details', params=params)

        # if venue has no categories, return invalid
        try:
            data['response']['venue']['categories']
        except Exception:
            print("Error getting Foursquare retail categories from name {0} and location {1}".format(name, location))
            print(data)
            result_valid = False
            return np.nan, np.nan, result_valid

        # collect all category types to store in Retailer object
        for cat in data['response']['venue']['categories']:
            types.add(cat["name"])

        # get price for a retailer
        try:
            price = data['response']['venue']['price']['tier']
        except Exception:
            price = np.nan

        return types, price, result_valid

    locations, valid = get_locations(name, location)
    types, price, valid2 = get_placedetails(name, location)

    if valid and valid2:
        retailer_valid = True
    else:
        retailer_valid = False

    #return Retailer object
    return Retailer(name, types, price, locations), retailer_valid

'''
This method gets the performance indicators for a retailer at a particular location

:param name: Retailer name
:type name: string
:param lat: latitude
:type lat: float
:param lng: longitude
:type lng: float
:return: likes, ratings, photo count, result_valid
:rtype: tuple(float, float, float, boolean)
'''
def get_performance(name, lat, lng):
    result_valid = True
    ####
    #### TODO: handling if multiple results are returned. currently just factors for 1
    #### TODO: currently only incorporates likes, ratings, and photo_count, but should expand to use geolocation data
    ####

    # search a retailer at location to get id
    url_search = 'https://api.foursquare.com/v2/venues/search'
    params = dict(
        client_id=FRSQ_ID,
        client_secret=FRSQ_SECRET,
        v='20191028',
        name=name,
        ll=str(lat)+","+str(lng),
        intent='match',
    )
    data = smart_search(url_search, 'foursquare', 'venues_search', params=params)

    #### TODO: run test to see whether search results return the right retailer

    # get id for retailer, return invalid if error
    try:
        id = data['response']['venues'][0]['id']
    except Exception:
        print("Error getting id from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data)
        return np.nan, np.nan, np.nan, False

    # get details for retailer based on id
    url_stats = 'https://api.foursquare.com/v2/venues/{0}'.format(id)
    params = dict(
        client_id=FRSQ_ID,
        client_secret=FRSQ_SECRET,
        v='20191028'
    )
    data = smart_search(url_stats, 'foursquare', 'venue_details', params=params)

    try:
        likes = data['response']['venue']['likes']['count']
    except Exception:
        print("Error getting likes from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data)
        likes = np.nan
        result_valid = False

    try:
        ratings = data['response']['venue']['rating']
    except Exception:
        ratings = np.nan

    try:
        photo_count = data['response']['venue']['photos']['count']
    except Exception:
        print("Error getting photo count from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data)
        photo_count = np.nan
        result_valid = False

    try:
        createdAt = data['response']['venue']['createdAt']
        age = (time.time() - createdAt) / 60 / 60 / 24 / 365  # age in years since the venue was created on foursquare
    except Exception:
        print("Error getting createdAt from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data)
        age = np.nan
        result_valid = False

    #### FIXME: replace foursquare photos with google photos
    try:
        photo_prefix = data['response']['venue']['bestPhoto']['prefix']
        photo_suffix = data['response']['venue']['bestPhoto']['suffix']
    except Exception:
        print("Error getting best photo from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data)
        photo_prefix = np.nan
        photo_suffix = np.nan

    return likes, ratings, age, photo_count, photo_prefix, photo_suffix, result_valid

if __name__ == "__main__":
    ###### DEBUG CODE #######
    retailer = 'Souvla'
    city = 'Hayes st San francisco'
    #lat, lng = get_loc_from_addr(retailer+" "+city)

    #print(get_performance(retailer, lat, lng))
    #businesses = generate_retailer_profile("Broken Yolk Cafe", "California")["businesses"]


    #print(generate_retailer_profile("Broken Yolk Cafe", "California"))

    #URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
    #    "New+York", GOOG_KEY)
    #print(smart_search(URL, None))

    generate_location_profile_new("327 1/2 E 1st St, Los Angeles, CA 90012")

