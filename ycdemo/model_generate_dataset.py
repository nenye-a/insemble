from __future__ import absolute_import, division, print_function, unicode_literals
import requests
import ycdemo.location_builder as lb
import numpy as np
import pandas as pd
import math

GOOG_KEY = "DELETED_GOOGLE_API_KEY"

'''

Function generates base data set for machine learning use. For a given city, state, or nation, function provides
unique existing locations, retail establishments, and their results. Function will randomly generates entries until 
the number of entries requested (length) is met.

:param focus_area: area of focus - can be the string name of any city, state, or nation 
:type str: ex  "New York, New York"
:param length: number of entries desired in the data set
:type int: 1,2,3,4...

:return list: tuples (location object, retailer object, linked performance) 
    
'''

def build_data_set(focus_area, length):

    ####TODO: fix magic number
    # 50,000 establishment safety factor
    # 20 results per query
    # need to make 2500 queries
    # take sqrt and it's 50 on each x,y
    num_queries = 1
    locations, ll_radius = segment_region(focus_area, num_queries)
    # assuming 1 latitude degree is 69 mi, 111045 m
    # assuming 1 longitude degree is 55 mi, 88514 m
    radius = ll_radius*88514

    ####TODO: put as global constant
    type_r = "restaurant"
    type_s = "store"

    dataset = set()

    for location in locations:
        lat, lng = location
        restaurant_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={0}&type={1}&radius={2}&key={3}".format(
        str(lat)+","+str(lng), type_r, radius, GOOG_KEY)
        retailer_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={0}&type={1}&radius={2}&key={3}".format(
            str(lat) + "," + str(lng), type_s, radius, GOOG_KEY)

        restaurant_data = requests.get(url=restaurant_URL)
        retailer_data = requests.get(url=retailer_URL)

        for restaurant in restaurant_data.json()["results"]:
            address = restaurant["vicinity"]
            rest_loc = lb.generate_location_profile(address, radius)
            rest_rtlr = lb.generate_retailer_profile(restaurant["name"], focus_area)
            dataset.add((rest_loc, rest_rtlr))

        for retailer in retailer_data.json()["results"]:
            address = retailer["vicinity"]
            rtlr_loc = lb.generate_location_profile(address, radius)
            rtlr_rtlr = lb.generate_retailer_profile(retailer["name"], focus_area)
            dataset.add((rtlr_loc, rtlr_rtlr))

        if len(dataset) > length:
            break

    return dataset

def segment_region(focus_area, num_queries):

    format_input = focus_area.replace(" ", "+")

    URL = "https://maps.googleapis.DELETED_BASE64_STRING?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
        format_input, GOOG_KEY)
    data = requests.get(url=URL)
    x_min = data.json()["candidates"][0]["geometry"]["viewport"]["southwest"]["lat"]
    x_max = data.json()["candidates"][0]["geometry"]["viewport"]["northeast"]["lat"]
    y_min = data.json()["candidates"][0]["geometry"]["viewport"]["southwest"]["lng"]
    y_max = data.json()["candidates"][0]["geometry"]["viewport"]["northeast"]["lng"]

    axis_queries = math.sqrt(num_queries)
    x_increment = (x_max-x_min)/axis_queries
    y_increment = (y_max-y_min)/axis_queries
    ll_radius = math.sqrt(x_increment**2+y_increment**2) / 2

    locations = set()
    for i in range(int(axis_queries)):
        for j in range(int(axis_queries)):
            locations.add((x_min + i*x_increment, y_min + j*y_increment))

    return locations, ll_radius


'''
#Old/inactive 

def google_text_search(query, query_type=None, pagetoken=None):

    # build our query
    query_url = "query={}".format(query.replace(" ", "+"))
    key_url = "key={}".format(GOOG_KEY)
    parameters = [query_url, key_url]

    # no need to add type if not necessary
    if query_type:
        type_url = "type={}".format(query_type)
        parameters.append(type_url)

    # no need to add pagination support if not necessary
    if pagetoken:
        pagetoken_url = "pagetoken={}".format(pagetoken)
        parameters.append(pagetoken_url)

    # build URL
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?"
    for param in parameters:
        url = url + param + "&"
    url = url[:-1]  # Remove the last "&" character from the string

    data = requests.get(url=url).json()
    results = data["results"]

    # Try to import any ensuing pages recursively
    try:
        next_page_data = google_text_search(query, query_type, data["next_page_token"])
        while not next_page_data: # there is a short delay when accessing next page results
            next_page_data = google_text_search(query, query_type, data["next_page_token"])
        results = results + next_page_data
    except KeyError:
        pass

    return results
'''

if __name__ == "__main__":
    focus_area = "New York, New York"
    print(segment_region(focus_area, 2500)[0])


    #loc_list = list(segment_region(focus_area, 2500)[0])
    #df = pd.DataFrame(loc_list, columns=["lat", "lng"])
    #df.to_csv('list.csv', index=False)
    #print(segment_region(focus_area, 2500))