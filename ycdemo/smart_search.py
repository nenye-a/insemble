import requests
import pickle
import pymongo
import dns

def smart_search(URL, params=None, headers=None):
    #search in internal database


    #if not there, search via google requests
    ####
    #### TODO: put search requests in db
    ####
    if params != None and headers != None:
        return requests.get(URL, params=params, headers=headers)
    elif params != None and headers == None:
        return requests.get(URL, params=params)
    elif params == None and headers != None:
        return requests.get(URL, headers=headers)
    else:
        return requests.get(URL)

if __name__ == "__main__":
    client = pymongo.MongoClient("mongodb+srv://webbco:DELETED_EMAIL/test?DELETED_RETRY_WRITES&w=majority")
    print("here")

    db = client.spaceData
    searches = db.searches
    import datetime

    search = {
        "url": URL,
        "params": params,
        "headers": headers,
        "result": requests.get(URL)
    }

    #insert a search result
    searches.insert_one(search)

    #find a result
    result = searches.find({"url": URL, "params": params, "headers": headers})