import requests
import pprint
import pickle
import dns
from mongo_connect import Connect

# initiate database collections
client = Connect.get_connection()
db = client.spaceData
searches = db.searches

# TODO: figure out if can reduce index creation & reduce redundancy
searches.create_index([("url",  1), ("params", 1), ("headers", 1)], unique=True)
hosts = ['google', 'yelp', 'foursquare', 'justicemap']
for host in hosts:
    searches[host].create_index([("url", 1), ("params", 1), ("headers", 1)], unique=True)
dataset2 = db.dataset2
dataset2.create_index([("name",  1), ("lat", 1), ("lng", 1)], unique=True)

'''
This method processes get requests to each of the host APIs, referring to a cache of saved searches if the search has 
already been performed. Every new search is cached in database. 

:param URL: the search query to feed into the requests module
:type URL: string, ex: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=33.7036519,-118.329670612&type=store&radius=804.67&key=DELETED_GOOGLE_API_KEY"
:param host: the platform on which the search is being made
:type host: string, ex: 'google'
:param search_type: the type of search, specified by the search platform docs
:type search_type: string, ex: 'nearbysearch'
:param params: optional parameters to feed into the search request
:type params: dictionary, ex: params = {client_id=<CLIENT_ID> client_secret=<CLIENT_SECRET> v='20191028'}
:param headers: optional headers to feed into the search request
:type headers: dictionary, ex: headers = {'Content-Type': 'application/json', 'x-api-key': CRIME_KEY}
:return result: requests.get result of search query
:rtype result: dictionary
'''
def smart_search(URL, host, search_type, params=None, headers=None):

    # search in internal databases
    host_db_return = searches[host].find_one({"url": URL, "params": params, "headers": headers})
    if host_db_return != None:
        return host_db_return["result"]

    # if it's in the old search database, take it from there and add it to the near search db with host & type tags
    db_return = searches.find_one({"url": URL, "params": params, "headers": headers})
    if db_return != None:
        db_return["host"] = host
        db_return["search_type"] = search_type
        searches[host].insert_one(db_return)
        return db_return["result"]

    search = {
        "url": URL,
        "host": host,
        "search_type": search_type,
        "params": params,
        "headers": headers,
    }

    # search using specified parameters
    try:
        if params != None and headers != None:
            result = requests.get(URL, params=params, headers=headers).json()
        elif params != None and headers == None:
            result = requests.get(URL, params=params).json()
        elif params == None and headers != None:
            result = requests.get(URL, headers=headers).json()
        else:
            result = requests.get(URL).json()
    except Exception:
        print("Error querying requests")
        return None

    # save search in database
    search["result"] = result
    searches[host].insert_one(search)
    return result

'''
This method processes repeat get requests to hosts that have multiple page results. Similar to smart search, this 
method refers to a cache of saved searches if the search has already been performed. Every new search is cached in 
database. 

:param URL: the search query to feed into the requests module
:type URL: string, ex: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=33.7036519,-118.329670612&type=store&radius=804.67&key=DELETED_GOOGLE_API_KEY"
:param host: the platform on which the search is being made
:type host: string, ex: 'google'
:param search_type: the type of search, specified by the search platform docs
:type search_type: string, ex: 'nearbysearch'
:param params: optional parameters to feed into the search request
:type params: dictionary, ex: params = {client_id=<CLIENT_ID> client_secret=<CLIENT_SECRET> v='20191028'}
:param headers: optional headers to feed into the search request
:type headers: dictionary, ex: headers = {'Content-Type': 'application/json', 'x-api-key': CRIME_KEY}
:return result: requests.get result of search query
:rtype result: dictionary
'''
def repeat_search(URL, host, search_type, params=None, headers=None):
    ####
    #### FIXME: consolidate funcitons with smart search (no redundant code)
    ####
    # search in internal database
    host_db_return = searches[host].find_one({"url": URL, "params": params, "headers": headers})
    if host_db_return != None:
        return host_db_return["result"]

    # if it's in the old search database, take it from there and add it to the near search db with host & type tags
    db_return = searches.find_one({"url": URL, "params": params, "headers": headers})
    if db_return != None:
        db_return["host"] = host
        db_return["search_type"] = search_type
        searches[host].insert_one(db_return)
        return db_return["result"]

    search = {
        "url": URL,
        "host": host,
        "search_type": search_type,
        "params": params,
        "headers": headers,
    }

    # keep searching until OK message obtained for next pages
    invalid = True
    while invalid:
        result = requests.get(URL).json()
        if result['status'] == 'OK':
            search["result"] = result
            searches[host].insert_one(search)
            invalid = False
    return result

'''
This method uploads Location and Retailer objects along with their performance metrics to a database

:param location: location profile 
:type location: Location object
:param retailer: retailer 
:type retailer: Retailer object
:param likes: number of likes for a retailer at that location
:type likes: integer
:param ratings: ratings for a retailer at that location
:type ratings: float
:param photo_count: number of photos for a particular retailer at that location
:type photo_count: integer
:return: boolean indicating whether a new entry was created in the database
:rtype: boolean 
'''
def upload_dataset(location, retailer, age, likes, ratings, photo_count):
    entry = {
        "name": retailer.name,
        "lat": location.lat,
        "lng": location.lng,
        "Location": location.to_json(),
        "Retailer": retailer.to_json(),
        "age": age,
        "likes": likes,
        "ratings": ratings,
        "photo_count": photo_count
    }

    # TODO: manage age updates when new data comes in
    # TODO: add last updated tag to dataset entries (or see if mongodb has)

    # search in internal database, return false if entry already exists
    db_return = dataset2.find_one({"name": entry["name"], "lat": entry["lat"], "lng": entry["lng"]})
    if db_return != None:
        print("Entry already exists for name: {0} at {1}, {2}".format(entry["name"], entry["lat"], entry["lng"]))
        return False

    # if entry does not exist in dataset, upload and return True
    dataset2.insert_one(entry)
    return True

if __name__ == "__main__":

    ### DEBUG CODE ###
    URL = 'https://maps.googleapis.DELETED_BASE64_STRING?input=San+Francisco&inputtype=textquery&fields=geometry&key=DELETED_GOOGLE_API_KEY'
    params = None
    headers = None

    client = Connect.get_connection()

    db = client.spaceData
    searches = db.searches

    '''
    search = {
        "url": URL,
        "params": params,
        "headers": headers,
        "result": requests.get(URL).json()
    }

    print("here")
    #insert a search result
    
    #searches.create_index([("url",  1), ("params", 1), ("headers", 1)], unique=True)
    print("there")
    searches.insert_one(search)
    print("where")
    searches.insert_one(search)
    '''

    #find a result
    cursor = searches.find_one({"url": URL, "params": params, "headers": headers})
    print(cursor["result"] == requests.get(URL).json())

    pprint.pprint(cursor)
    print("---------------------------")
    print(cursor["result"]["candidates"][0]["geometry"])