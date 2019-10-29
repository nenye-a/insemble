import requests
import json
from yelp.client import Client
from Location import Location

#### TODO: keep secret by using environment variables

#please don't share
GOOG_KEY = "AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U"
YELP_KEY= "5j79CVtQUMZdcsAbR6ygGC8n0ao3nADNVUmvpkhj1kUmYm9smdV76djfbceSoFfbFC-poMH0Lvj1ijZcLNF79agt7HrozEGy-RaRp2Dn5ojcCYNCEWqvoC0NsYK2XXYx"
FRSQ_ID = "1H2JSWUCK0MGC4SKOVNGXVF3G5421KFDL30UF1EBMTQSHYQQ"
FRSQ_SECRET = "G2FVXGNFR3D04GF0QJBI50XAJGVT3S2V0DYNEQTVPZZLGLQI"

def get_loc_from_addr(address):
    ####
    #### TODO: exception handling
    ####

    # parse string address for something readable by google
    format_address = address.replace(" ", "+")

    URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
        format_address, GOOG_KEY)
    data = requests.get(url=URL)
    lat = data.json()["candidates"][0]["geometry"]["location"]["lat"]
    lng = data.json()["candidates"][0]["geometry"]["location"]["lng"]

    return lat, lng

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

    lat, lng = get_loc_from_addr(address)
    census, pop, income = get_demographics(lat, lng)
    nearby = get_nearby_stores(lat,lng)
    ####
    #### TODO: reorganize locations inputs without traffic & safety
    ####

    #return Location object
    return Location(address, census, pop, income, None, None, nearby, radius)

def generate_retailer_profile(name):
    def get_locations(name):
        pass

    def get_placetype(name):
        pass

    def get_cost(name):
        pass

    #return Retailer object
    return

def get_performance(retailer, lat, lng):
    ####
    #### TODO: handling if multiple results are returned. currently just factors for 1
    #### TODO: currently only incorporates likes, but should expand to use geolocation data
    ####
    url_search = 'https://api.foursquare.com/v2/venues/search'
    params = dict(
        client_id=FRSQ_ID,
        client_secret=FRSQ_SECRET,
        v='20191028',
        name=retailer,
        ll=str(lat)+","+str(lng),
        intent='match',
    )
    resp = requests.get(url=url_search, params=params)
    data = json.loads(resp.text)
    id = data['response']['venues'][0]['id']

    #url_likes = 'https://api.foursquare.com/v2/venues/{0}/likes'.format(id)
    url_stats = 'https://api.foursquare.com/v2/venues/{0}'.format(id)

    params = dict(
        client_id=FRSQ_ID,
        client_secret=FRSQ_SECRET,
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
    lat, lng = get_loc_from_addr(retailer+" "+city)

    print(get_performance(retailer, lat, lng))
