from __future__ import absolute_import, division, print_function, unicode_literals
import requests
import tensorflow as tf
import numpy as np
import pandas as pd
from tensorflow import keras

GOOG_KEY = "DELETED_GOOGLE_API_KEY"

'''

Function generates base data set for machine learning use. For a given city, state, or nation, function provides
unique existing locations, retail establishments, and their results. Function will randomly generates entries until 
the number of entries requested (length) is met.

:param area: area of focus - can be the string name of any city, state, or nation 
:type str: ex  "New York, New York"
:param length: number of entries desired in the data set
:type int: 1,2,3,4...

:return list: tuples (location object, retailer object, linked performance) 
    
'''

def build_data_set(focus_area, length):

    return data_set


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
