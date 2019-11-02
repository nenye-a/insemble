import requests
import json
import time
import numpy as np
from Location import Location
from Retailer import Retailer

#### TODO: keep secret by using environment variables
#### TODO: consolidate APIs (to use fewer if possible)

#please don't share
GOOG_KEY = "AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U"
YELP_KEY= "5j79CVtQUMZdcsAbR6ygGC8n0ao3nADNVUmvpkhj1kUmYm9smdV76djfbceSoFfbFC-poMH0Lvj1ijZcLNF79agt7HrozEGy-RaRp2Dn5ojcCYNCEWqvoC0NsYK2XXYx"
FRSQ_ID = "1H2JSWUCK0MGC4SKOVNGXVF3G5421KFDL30UF1EBMTQSHYQQ"
FRSQ_SECRET = "G2FVXGNFR3D04GF0QJBI50XAJGVT3S2V0DYNEQTVPZZLGLQI"
CRIME_KEY = "Sy1yUKcHl58o442f6qT7185UF1WYx7Qh6UdqrEMf"

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

    # parse string address for something readable by google
    format_input = input.replace(" ", "+")

    URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
        format_input, GOOG_KEY)
    data = requests.get(url=URL)

    try:
        lat = data.json()["candidates"][0]["geometry"]["location"]["lat"]
        lng = data.json()["candidates"][0]["geometry"]["location"]["lng"]
    except Exception:
        print("Error getting location from input {0}".format(input))
        print(data.json())
        lat = np.nan
        lng = np.nan

    return lat, lng


'''
This method creates a location profile for a particular address. It pulls in information from various APIs to create Locations

:param address: street address of establishment
:type address: string
:param radius: radius to use for surrounding influence drivers
:type radius: float
:return: Location object with demographic and local details
:rtype: Location
'''
def generate_location_profile(address, radius):

    def get_demographics(lat, lng):
        sGeo = "tract"
        URL = "http://www.spatialjusticetest.org/api.php?fLat={0}&fLon={1}&sGeo={2}&fRadius={3}".format(lat,lng,sGeo,radius)
        data = requests.get(url = URL)

        try:

            census = {"asian":float(data.json()["asian"]), "black":float(data.json()["black"]), "hispanic":float(data.json()["hispanic"]),
                  "indian":float(data.json()["indian"]), "multi":float(data.json()["multi"]), "white":float(data.json()["white"])}


            ####
            #### TODO: exception handling, incorporate radius
            ####
            pop = int(data.json()["pop"])
            income = float(data.json()["income"])

        except Exception:
            print("Error getting demographics from lat {0} and lng {1}".format(lat, lng))
            print(data.json())
            census = np.nan
            pop = np.nan
            income = np.nan

        return census, pop, income

    def get_nearby_stores(lat, lng):
        # client = Client(YELP_KEY)

        ####
        #### TODO: need to incorporate proximity & radius
        ####
        url = "https://api.yelp.com/v3/businesses/search"
        data = requests.get(url, params={'latitude': lat, 'longitude': lng},
                            headers={'Authorization': 'bearer %s' % YELP_KEY})

        try:
            businesses = data.json()["businesses"]
            businesses[0]["categories"]

        except Exception:
            print("Error getting nearby stores from lat {0} and lng {1}".format(lat, lng))
            print(data.json())
            return np.nan

        nearby = {}
        for bus in businesses:
            for cat in bus["categories"]:
                try:
                    nearby[cat["alias"]] = nearby[cat["alias"]] + 1
                except Exception:
                    nearby[cat["alias"]] = 1

        return nearby

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
        data = requests.get(URL, headers=headers)


        pass

    lat, lng = get_loc_from_input(address)
    census, pop, income = get_demographics(lat, lng)
    nearby = get_nearby_stores(lat,lng)
    ####
    #### TODO: reorganize locations inputs without traffic. incorporate safety
    ####

    #return Location object
    return Location(address, census, pop, income, None, None, nearby, None)

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
        ####
        #### TODO: make location param optional
        #### TODO: error checking for retailer names
        #### TODO: check if all loctions pulled are indeed that retailer
        ####
        input = name+" "+location

        # parse string address for something readable by google
        format_input = input.replace(" ", "+")
        URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query={0}&key={1}".format(format_input, GOOG_KEY)
        data = requests.get(url=URL)

        locations = set()

        for result in data.json()['results']:
            try:
                lat, lng = result['geometry']['location']['lat'], result['geometry']['location']['lat']
            except Exception:
                print("Error getting retail locations from name {0} and location {1}".format(name, location))
                print(data.json())
                lat = np.nan
                lng = np.nan
            locations.add((lat, lng))

        more_pages = True
        while more_pages:
            try:
                page_token = data.json()['next_page_token']
                URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query={0}&key={1}&pagetoken={2}".format(input, GOOG_KEY, page_token)

                invalid = True
                while invalid:
                    data = requests.get(url=URL)
                    if data.json()['status'] == 'OK':
                        invalid = False

                for result in data.json()['results']:
                    try:
                        lat, lng = result['geometry']['location']['lat'], result['geometry']['location']['lat']
                    except Exception:
                        print("Error getting retail locations from name {0} and location {1}".format(name, location))
                        print(data.json())
                        lat = np.nan
                        lng = np.nan
                    locations.add((lat, lng))
            except:
                more_pages = False

        return locations

    def get_placedetails(name, location):
        input = name + " " + location

        #### TODO: may want to aggregate types over all locations
        lat, lng = get_loc_from_input(input)
        url = "https://api.yelp.com/v3/businesses/search"
        data = requests.get(url, params={'term': name, 'latitude': lat, 'longitude': lng},
                            headers={'Authorization': 'bearer %s' % YELP_KEY})

        print(data.json())
        types = set()
        #### TODO: ensure right retailer
        try:
            data.json()['businesses'][0]['categories']
        except Exception:
            print("Error getting retail categories from name {0} and location {1}".format(name, location))
            print(data.json())
            return np.nan, np.nan

        for cat in data.json()['businesses'][0]['categories']:
            types.add(cat["alias"])

        try:
            price = data.json()['businesses'][0]['price']
        except Exception:
            price = None

        return types, price

    locations = get_locations(name, location)
    types, price = get_placedetails(name, location)

    #return Retailer object
    return Retailer(name, types, price, locations)

'''
This method gets the performance indicators for a retailer at a particular location

:param name: Retailer name
:type name: string
:param lat: latitude
:type lat: float
:param lng: longitude
:type lng: float
:return: likes, ratings, photo count
:rtype: tuple(float)
'''
def get_performance(name, lat, lng):
    ####
    #### TODO: handling if multiple results are returned. currently just factors for 1
    #### TODO: currently only incorporates likes, ratings, and photo_count, but should expand to use geolocation data
    ####
    url_search = 'https://api.foursquare.com/v2/venues/search'
    params = dict(
        client_id=FRSQ_ID,
        client_secret=FRSQ_SECRET,
        v='20191028',
        name=name,
        ll=str(lat)+","+str(lng),
        intent='match',
    )
    resp = requests.get(url=url_search, params=params)
    data = json.loads(resp.text)

    try:
        id = data['response']['venues'][0]['id']
    except Exception:
        print("Error getting id from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data.json())
        return np.nan, np.nan, np.nan

    #url_likes = 'https://api.foursquare.com/v2/venues/{0}/likes'.format(id)
    url_stats = 'https://api.foursquare.com/v2/venues/{0}'.format(id)

    params = dict(
        client_id=FRSQ_ID,
        client_secret=FRSQ_SECRET,
        v='20191028'
    )
    resp = requests.get(url=url_stats, params=params)
    data = json.loads(resp.text)
    try:
        likes = data['response']['venue']['likes']['count']
    except Exception:
        print("Error getting likes from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data.json())
        likes = np.nan
    try:
        ratings = data['response']['venue']['rating']
    except Exception:
        print("Error getting likes from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data.json())
        ratings = np.nan
    try:
        photo_count = data['response']['venue']['photos']['count']
    except Exception:
        print("Error getting likes from name {0}, lat {1} and lng {2}".format(name, lat, lng))
        print(data.json())
        photo_count = np.nan
    return likes, ratings, photo_count

if __name__ == "__main__":
    retailer = 'Souvla'
    city = 'Hayes st San francisco'
    #lat, lng = get_loc_from_addr(retailer+" "+city)

    #print(get_performance(retailer, lat, lng))
    #businesses = generate_retailer_profile("Broken Yolk Cafe", "California")["businesses"]

    print(generate_retailer_profile("Broken Yolk Cafe", "California"))
