import json
import time
import numpy as np
import urllib.parse
from Location import Location
from Retailer import Retailer
from smart_search import *

#### TODO: keep secret by using environment variables
#### TODO: consolidate APIs (to use fewer if possible)

#please don't share
GOOG_KEY = "DELETED_GOOGLE_API_KEY"
YELP_KEY= "DELETED_BASE64_STRING-poMH0Lvj1ijZcLNF79agt7HrozEGy-RaRp2Dn5ojcCYNCEWqvoC0NsYK2XXYx"
# FRSQ_ID = "DELETED_BASE64_STRING" # Colin's Foursquare ID
# FRSQ_SECRET = "DELETED_BASE64_STRING" # Colin's Foursquare Secret
FRSQ_ID = "DELETED_BASE64_STRING" # Nenye's Foursquare ID
FRSQ_SECRET = "DELETED_BASE64_STRING" # Nenye's Foursquare Secrete
CRIME_KEY = "DELETED_BASE64_STRING"
MONGO_KEY = "4deeabe1-0fa2-4ee7-a4e6-372ba9f46de8"
MILES_TO_M = 1609.34

'''
This method takes in a text query, such as a retailer name, address, or city, and generates a location from it. 

:param input: query to search
:type input: string, ex: "soulva hayes st"
:return:  latitude and longitude of the queried location
:rtype: float tuple, ex: (33.5479999,-117.6711493)
'''
def get_loc_from_input(input):
    ####
    #### TODO: exception handling, error checking to find the right locations/retailer names
    ####
    result_valid = True

    # parse string address for something readable by google
    #format_input = input.replace(" ", "+")
    format_input = urllib.parse.quote(input)

    URL = "https://maps.googleapis.DELETED_BASE64_STRING?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
        format_input, GOOG_KEY)
    data = smart_search(URL)

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

    def get_demographics(lat, lng, radius):
        result_valid = True
        sGeo = "tract"
        URL = "http://www.spatialjusticetest.org/api.php?fLat={0}&fLon={1}&sGeo={2}&fRadius={3}".format(lat,lng,sGeo,radius)
        data = smart_search(URL)

        try:

            census = {"asian":float(data["asian"]), "black":float(data["black"]), "hispanic":float(data["hispanic"]),
                  "indian":float(data["indian"]), "multi":float(data["multi"]), "white":float(data["white"])}
            pop = int(data["pop"])
            income = float(data["income"])

        except Exception:
            print("Error getting demographics from lat {0} and lng {1}".format(lat, lng))
            print(data)
            census = np.nan
            pop = np.nan
            income = np.nan
            result_valid = False

        return census, pop, income, result_valid

    def get_nearby_stores(lat, lng, radius):
        result_valid = True
        ####
        #### TODO: need to incorporate proximity (closer stores... more influence)
        #### replace yelp
        # url = "https://api.yelp.com/v3/businesses/search"
        # data = smart_search(url, params={'latitude': lat, 'longitude': lng, 'radius': int(radius*MILES_TO_M)},
        #                     headers={'Authorization': 'bearer %s' % YELP_KEY})
        #
        # try:
        #     businesses = data["businesses"]
        #     businesses[0]["categories"]
        #
        # except Exception:
        #     print("Error getting nearby stores from lat {0} and lng {1}".format(lat, lng))
        #     print(data)
        #     result_valid = False
        #     return np.nan, result_valid
        #
        # nearby = {}
        # for bus in businesses:
        #     for cat in bus["categories"]:
        #         try:
        #             nearby[cat["alias"]] = nearby[cat["alias"]] + 1
        #         except Exception:
        #             nearby[cat["alias"]] = 1
        #
        # #############

        nearby = {}
        #### TODO: ensure right retailer

        url_search = 'https://api.foursquare.com/v2/venues/search'
        params = dict(
            client_id=<CLIENT_ID>
            client_secret=<CLIENT_SECRET>
            v='20191028',
            ll=str(lat) + "," + str(lng),
            intent='browse',
            radius=radius*MILES_TO_M
        )
        data = smart_search(url_search, params=params)

        try:
            data['response']['venues'][0]['categories'][0]
        except Exception:
            print("Error getting Foursquare retail categories from {0}, {1} with radius {2}".format(lat, lng, radius))
            print(data)
            result_valid = False
            return np.nan, result_valid

        for venue in data['response']['venues']:
            for cat in venue["categories"]:
                try:
                    nearby[cat["name"]] = nearby[cat["name"]] + 1
                except Exception:
                    nearby[cat["name"]] = 1

        return nearby, result_valid

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
        data = smart_search(URL, headers=headers)


        pass

    lat, lng, valid = get_loc_from_input(address)
    if not valid:
        return None, valid

    census, pop, income, valid2 = get_demographics(lat, lng, radius)
    nearby, valid3 = get_nearby_stores(lat, lng, radius)
    ####
    #### TODO: reorganize locations inputs without traffic. incorporate safety
    ####

    if valid and valid2 and valid3:
        location_valid = True
    else:
        location_valid = False

    #return Location object
    return Location(address, lat, lng, census, pop, income, None, None, nearby, radius), location_valid

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
        #### TODO: make location param optional
        #### TODO: error checking for retailer names
        #### TODO: check if all loctions pulled are indeed that retailer
        ####
        input = name+" "+location

        # parse string address for something readable by google
        format_input = urllib.parse.quote(input)
        URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query={0}&key={1}".format(format_input, GOOG_KEY)

        data = smart_search(URL)

        locations = set()

        for result in data['results']:
            try:
                lat, lng = result['geometry']['location']['lat'], result['geometry']['location']['lat']
                locations.add((lat, lng))
            except Exception:
                print("Error getting retail locations from name {0} and location {1}. Not adding.".format(name, location))
                print(data)

        more_pages = True
        while more_pages:
            try:
                page_token = data['next_page_token']
                URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query={0}&key={1}&pagetoken={2}".format(input, GOOG_KEY, page_token)

                data = repeat_search(URL)

                for result in data['results']:
                    try:
                        lat, lng = result['geometry']['location']['lat'], result['geometry']['location']['lat']
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

        types = set()
        #### TODO: ensure right retailer

        url_search = 'https://api.foursquare.com/v2/venues/search'
        params = dict(
            client_id=<CLIENT_ID>
            client_secret=<CLIENT_SECRET>
            v='20191028',
            name=name,
            ll=str(lat) + "," + str(lng),
            intent='checkin',
        )
        data = smart_search(url_search, params=params)

        try:
            id = data['response']['venues'][0]['id']
        except Exception:
            print("Error getting id on Foursquare from name {0}, lat {1} and lng {2}".format(name, lat, lng))
            print(data)
            return np.nan, np.nan, False

        url_stats = 'https://api.foursquare.com/v2/venues/{0}'.format(id)

        params = dict(
            client_id=<CLIENT_ID>
            client_secret=<CLIENT_SECRET>
            v='20191028'
        )
        data = smart_search(url_stats, params=params)

        try:
            data['response']['venue']['categories'][0]
        except Exception:
            print("Error getting Foursquare retail categories from name {0} and location {1}".format(name, location))
            print(data)
            result_valid = False
            return np.nan, np.nan, result_valid

        for cat in data['response']['venue']['categories']:
            types.add(cat["name"])

        try:
            price = data['response']['venue']['price']['tier']
        except Exception:
            price = np.nan
            result_valid = False

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
    url_search = 'https://api.foursquare.com/v2/venues/search'
    params = dict(
        client_id=<CLIENT_ID>
        client_secret=<CLIENT_SECRET>
        v='20191028',
        name=name,
        ll=str(lat)+","+str(lng),
        intent='match',
    )
    data = smart_search(url_search, params=params)

    try:
        id = data['response']['venues'][0]['id']
    except Exception:
        print("Error getting id from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data)
        return np.nan, np.nan, np.nan, False

    #url_likes = 'https://api.foursquare.com/v2/venues/{0}/likes'.format(id)
    url_stats = 'https://api.foursquare.com/v2/venues/{0}'.format(id)

    params = dict(
        client_id=<CLIENT_ID>
        client_secret=<CLIENT_SECRET>
        v='20191028'
    )
    data = smart_search(url_stats, params=params)

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
    return likes, ratings, photo_count, result_valid

if __name__ == "__main__":
    retailer = 'Souvla'
    city = 'Hayes st San francisco'
    #lat, lng = get_loc_from_addr(retailer+" "+city)

    #print(get_performance(retailer, lat, lng))
    #businesses = generate_retailer_profile("Broken Yolk Cafe", "California")["businesses"]


    #print(generate_retailer_profile("Broken Yolk Cafe", "California"))

    URL = "https://maps.googleapis.DELETED_BASE64_STRING?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
        "New+York", GOOG_KEY)
    print(smart_search(URL, None))