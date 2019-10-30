import requests
import json
import time
from yelp.client import Client
from Location import Location
from Retailer import Retailer

#### TODO: keep secret by using environment variables
#### TODO: consolidate APIs (to use fewer if possible)

#please don't share
GOOG_KEY = "DELETED_GOOGLE_API_KEY"
YELP_KEY= "DELETED_BASE64_STRING-poMH0Lvj1ijZcLNF79agt7HrozEGy-RaRp2Dn5ojcCYNCEWqvoC0NsYK2XXYx"
FRSQ_ID = "DELETED_BASE64_STRING"
FRSQ_SECRET = "DELETED_BASE64_STRING"

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

    URL = "https://maps.googleapis.DELETED_BASE64_STRING?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
        format_input, GOOG_KEY)
    data = requests.get(url=URL)
    lat = data.json()["candidates"][0]["geometry"]["location"]["lat"]
    lng = data.json()["candidates"][0]["geometry"]["location"]["lng"]

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
        census = {"asian":float(data.json()["asian"]), "black":float(data.json()["black"]), "hispanic":float(data.json()["hispanic"]),
                  "indian":float(data.json()["indian"]), "multi":float(data.json()["multi"]), "white":float(data.json()["white"])}


        ####
        #### TODO: exception handling, incorporate radius
        ####
        pop = int(data.json()["pop"])
        income = float(data.json()["income"])
        return census, pop, income

    def get_nearby_stores(lat, lng):
        # client = Client(YELP_KEY)

        ####
        #### TODO: need to incorporate proximity & radius
        ####
        url = "https://api.yelp.com/v3/businesses/search"
        data = requests.get(url, params={'latitude': lat, 'longitude': lng},
                            headers={'Authorization': 'bearer %s' % YELP_KEY})

        businesses = data.json()["businesses"]

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

        pass

    lat, lng = get_loc_from_input(address)
    census, pop, income = get_demographics(lat, lng)
    nearby = get_nearby_stores(lat,lng)
    ####
    #### TODO: reorganize locations inputs without traffic & safety
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
            lat, lng = result['geometry']['location']['lat'], result['geometry']['location']['lat']
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
                    lat, lng = result['geometry']['location']['lat'], result['geometry']['location']['lat']
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
        for cat in data.json()['businesses'][0]['categories']:
            types.add(cat["alias"])

        price = data.json()['businesses'][0]['price']

        return types, price

    locations = get_locations(name, location)
    types, price = get_placedetails(name, location)

    #return Retailer object
    return Retailer(name,types,price,locations)

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
        client_id=<CLIENT_ID>
        client_secret=<CLIENT_SECRET>
        v='20191028',
        name=name,
        ll=str(lat)+","+str(lng),
        intent='match',
    )
    resp = requests.get(url=url_search, params=params)
    data = json.loads(resp.text)
    id = data['response']['venues'][0]['id']

    #url_likes = 'https://api.foursquare.com/v2/venues/{0}/likes'.format(id)
    url_stats = 'https://api.foursquare.com/v2/venues/{0}'.format(id)

    params = dict(
        client_id=<CLIENT_ID>
        client_secret=<CLIENT_SECRET>
        v='20191028'
    )
    resp = requests.get(url=url_stats, params=params)
    data = json.loads(resp.text)
    likes = data['response']['venue']['likes']['count']
    ratings = data['response']['venue']['rating']
    photo_count = data['response']['venue']['photos']['count']
    return likes, ratings, photo_count

if __name__ == "__main__":
    retailer = 'Souvla'
    city = 'Hayes st San francisco'
    #lat, lng = get_loc_from_addr(retailer+" "+city)

    #print(get_performance(retailer, lat, lng))
    #businesses = generate_retailer_profile("Broken Yolk Cafe", "California")["businesses"]

    print(generate_retailer_profile("Broken Yolk Cafe", "California"))
