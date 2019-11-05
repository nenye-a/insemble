from __future__ import absolute_import, division, print_function, unicode_literals
import location_builder as lb
import pickle
import numpy as np
import pandas as pd
import math
import time
import random
import urllib.parse
from smart_search import *

GOOG_KEY = "AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U"
MILES_TO_M = 1609.34

TYPE_R = "restaurant"
TYPE_S = "store"
# assuming 1 latitude degree is 69 mi, 111045 m
# assuming 1 longitude degree is 55 mi, 88514 m
# NOTE: radius (in miles) doesn't use segment radius
RADIUS = 0.5

'''

Function generates base data set for machine learning use. For a given city, state, or nation, function provides
unique existing locations, retail establishments, and their results. Function will randomly find entries within the 
region until the number of entries requested (length) is met.

:param focus_area: area of focus - can be the string name of any city, state, or nation 
:type focus_area: string, ex  "New York, New York"
:param length: number of entries desired in the data set
:type length: integer

:return dataset: name, latitude, and longitude of existing establishment
:rtype dataset: tuple (string, float, float)
    
'''

def build_data_set(focus_area, length):

    ####TODO: fix magic number
    # 50,000 establishment safety factor
    # 20 results per query
    # need to make 2500 queries
    # take sqrt and it's 50 on each x,y

    # get list of random locations to query
    num_queries = 2500
    locations_set, ll_radius = segment_region(focus_area, num_queries)
    locations = list(locations_set)
    random.shuffle(locations)

    dataset = set()

    # iterate through locations in focus area
    print("iterating through {0} focus area locations to build dataset".format(len(locations)))
    for location in locations:

        # search nearby restaurants and retailers for location
        lat, lng = location
        restaurant_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={0}&type={1}&radius={2}&key={3}".format(
        str(lat)+","+str(lng), TYPE_R, RADIUS*MILES_TO_M, GOOG_KEY)
        retailer_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={0}&type={1}&radius={2}&key={3}".format(
            str(lat) + "," + str(lng), TYPE_S, RADIUS*MILES_TO_M, GOOG_KEY)

        print("getting nearby restaurants and retailers for {0},{1}".format(lat, lng))
        restaurant_data = smart_search(restaurant_URL, 'google', 'nearbysearch')
        retailer_data = smart_search(retailer_URL, 'google', 'nearbysearch')

        # verify data yields results
        try:
            restaurant_data["results"]
            retailer_data["results"]
        except Exception:
            print("Error getting nearby restaurant or retailer details from {0} and lng {1}".format(lat, lng))
            print(restaurant_data)
            print(retailer_data)
            continue

        # build profiles for restaurants and retailers returned in nearby search
        print("building profiles for {0} nearby retailers and {1} nearby restaurants".format(len(retailer_data["results"]),
                                                                                                      len(restaurant_data["results"])))
        for retailer in retailer_data["results"]:
            if len(dataset) >= length:
                print("{0} businesses in dataset now. Finished".format(len(dataset)))
                return dataset

            try:
                address = retailer["vicinity"]
            except:
                print("Error getting address of nearby retailer at location at lat {0} and lng {1}".format(lat, lng))
                print(restaurant_data)
                continue

            rtlr_rtlr, retailer_valid = lb.generate_retailer_profile(retailer["name"], focus_area)
            # time.sleep(.7)
            if not retailer_valid:
                continue
            rtlr_loc, location_valid  = lb.generate_location_profile(address, RADIUS)
            #time.sleep(.7)

            #get performance metrics for retailer at location
            if location_valid and retailer_valid:
                rtlr_likes, rtlr_ratings, rtlr_photo_count, rtlr_performance_valid = lb.get_performance(rtlr_rtlr.name,
                                                                                                        rtlr_loc.lat,
                                                                                                        rtlr_loc.lng)
                #time.sleep(.7)
                # upload to dataset
                if rtlr_performance_valid:
                    new_entry = upload_dataset(rtlr_loc, rtlr_rtlr, rtlr_likes, rtlr_ratings, rtlr_photo_count)
                    if new_entry:
                        dataset.add((rtlr_rtlr.name, rtlr_loc.lat, rtlr_loc.lng))
                        print("new retailer profile for {0} at {1}, {2}".format(rtlr_rtlr.name, rtlr_loc.lat, rtlr_loc.lng))

        for restaurant in restaurant_data["results"]:
            if len(dataset) >= length:
                print("{0} businesses in dataset now. Finished".format(len(dataset)))
                return dataset

            try:
                address = restaurant["vicinity"]
            except:
                print("Error getting address of nearby restaurant from location at lat {0} and lng {1}".format(lat, lng))
                print(restaurant_data)
                continue

            rest_rtlr, retailer_valid = lb.generate_retailer_profile(restaurant["name"], focus_area)
            # time.sleep(.7)
            if not retailer_valid:
                continue

            rest_loc, location_valid = lb.generate_location_profile(address, RADIUS)
            # time.sleep(.7)

            # get performance metrics for restaurant at location
            if location_valid and retailer_valid:
                rest_likes, rest_ratings, rest_photo_count, rest_performance_valid = lb.get_performance(rest_rtlr.name,
                                                                                                        rest_loc.lat,
                                                                                                        rest_loc.lng)
                #time.sleep(.7)
                # upload to dataset
                if rest_performance_valid:
                    new_entry = upload_dataset(rest_loc, rest_rtlr, rest_likes, rest_ratings, rest_photo_count)
                    if new_entry:
                        dataset.add((rest_rtlr.name, rest_loc.lat, rest_loc.lng))
                        print("new restaurant profile for {0} at {1}, {2}".format(rest_rtlr.name, rest_loc.lat, rest_loc.lng))

        print("location profiles built for nearby stores")
        print("{0} businesses in dataset now".format(len(dataset)))

        if len(dataset) > length:
            break

    return dataset

'''
This method generates coordinates evenly distributed across a desired focus area

:param focus_area: area of focus - can be the string name of any city, state, or nation
:type focus_area: string, ex  "New York, New York"
:param num_queries: number of locations within a city to generate lat, lng pairs
:type num_queries: int

:return: locations and half-radius between locations
:rtype: tuple (set (float, float), float)
'''
def segment_region(focus_area, num_queries):

    format_input = urllib.parse.quote(focus_area)

    URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={0}&inputtype=textquery&fields=geometry&key={1}".format(
        format_input, GOOG_KEY)

    print("querying {0} regions in the {1} focus area".format(num_queries, focus_area))
    data = smart_search(URL, 'google', 'findplacefromtext')
    x_min = data["candidates"][0]["geometry"]["viewport"]["southwest"]["lat"]
    x_max = data["candidates"][0]["geometry"]["viewport"]["northeast"]["lat"]
    y_min = data["candidates"][0]["geometry"]["viewport"]["southwest"]["lng"]
    y_max = data["candidates"][0]["geometry"]["viewport"]["northeast"]["lng"]

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
    ####
    #### TODO: timestamps on print statements.
    ####
    focus_area = "Los Angeles, California"
    length = 2000
    dataset = build_data_set(focus_area, length)


    #loc_list = list(segment_region(focus_area, 2500)[0])
    #df = pd.DataFrame(loc_list, columns=["lat", "lng"])
    #df.to_csv('list.csv', index=False)
    #print(segment_region(focus_area, 2500))