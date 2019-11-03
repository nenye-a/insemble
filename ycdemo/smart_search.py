import requests
import pprint
import pickle
import dns
from MongoConnect import Connect

client = Connect.get_connection()
db = client.spaceData
searches = db.searches
searches.create_index([("url",  1), ("params", 1), ("headers", 1)], unique=True)
dataset2 = db.dataset2
dataset2.create_index([("name",  1), ("lat", 1), ("lng", 1)], unique=True)

def smart_search(URL, params=None, headers=None):

    #search in internal database
    db_return = searches.find_one({"url": URL, "params": params, "headers": headers})
    if db_return != None:
        return db_return["result"]

    #if not there, search via google requests
    ####
    #### TODO: put search requests in db
    ####

    search = {
        "url": URL,
        "params": params,
        "headers": headers,
    }

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

    search["result"] = result
    searches.insert_one(search)
    return result

def repeat_search(URL, params=None, headers=None):
    # search in internal database
    db_return = searches.find_one({"url": URL, "params": params, "headers": headers})
    if db_return != None:
        return db_return["result"]

    search = {
        "url": URL,
        "params": params,
        "headers": headers,
    }

    invalid = True
    while invalid:
        result = requests.get(URL).json()
        if result['status'] == 'OK':
            search["result"] = result
            searches.insert_one(search)
            invalid = False
    return result

def upload_dataset(location, retailer, likes, ratings, photo_count):
    entry = {
        "name": retailer.name,
        "lat": location.lat,
        "lng": location.lng,
        "Location": location.to_json(),
        "Retailer": retailer.to_json(),
        "likes": likes,
        "ratings": ratings,
        "photo_count": photo_count
    }
    # search in internal database
    db_return = dataset2.find_one({"name": entry["name"], "lat": entry["lat"], "lng": entry["lng"]})
    if db_return != None:
        print("Entry already exists for name: {0} at {1}, {2}".format(entry["name"], entry["lat"], entry["lng"]))
        return

    dataset2.insert_one(entry)

if __name__ == "__main__":

    ### DEBUG CODE ###
    URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=San+Francisco&inputtype=textquery&fields=geometry&key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U'
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