from decouple import config
import utils
import requests
import json
import time

'''

All google related methods to build locations

'''

GOOG_KEY = config("GOOG_KEY")

# Google endpoints. Refer to https://developers.google.com/places/web-service/intro for details.
GOOG_FINDPLACE_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
GOOG_NEARBY_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
GOOG_DETAILS_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/details/json'
GOOG_TEXTSEARCH_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'


# Provided a location address & name, method corrects address if available in google. Method
# corrects address if available in google. Returns google place_id, geometry, address, & name
# If bias needed, please specific in bias field as per the google API
# TODO: ensure that no duplicates are stored, and that no repeat searches are completed
def find(address, name="", bias='ipbias'):

    url = GOOG_FINDPLACE_ENDPOINT
    payload = {}
    headers = {}
    params = {
        'key': GOOG_KEY,
        'input': address + name,
        'inputtype': 'textquery',  # text input
        'language': 'en',  # return in english
        'locationbias': bias,
        'fields': 'place_id,formatted_address,name,geometry'
    }

    response = requests.request(
        "GET", url, headers=headers, data=payload, params=params)

    response = json.loads(response.text)
    place = response['candidates'][0]  # first candidate is the actual place

    return place


# Given google place ID, can generate the other nearby locations.
# By default, algorithm returns all results in 1 miles up to 60.
def nearby(lat, lng, category, radius=1, pagetoken=None):

    url = GOOG_NEARBY_ENDPOINT

    payload = {}
    headers = {}

    params = {
        'key': GOOG_KEY
    }

    # get next page from previous request, or initiate new request
    if pagetoken:
        params.update({
            'pagetoken': pagetoken
        })
    else:
        location = str(lat) + ',' + str(lng)
        radius = str(utils.miles_to_meters(radius))
        params.update({
            'location': location,
            'radius': radius,
            'type': category,
            'language': 'en',
            'rankby': 'prominence'
        })

    response = requests.request(
        "GET", url, headers=headers, data=payload, params=params)
    result = json.loads(response.text)

    # if new page request fails, try again until it completes
    if pagetoken and result['status'] == 'INVALID_REQUEST':
        time.sleep(1)
        next_page = nearby(lat, lng, category, pagetoken=pagetoken)
        result["results"].extend(next_page)

    # call to get he next page
    if "next_page_token" in result:
        next_page_token = result["next_page_token"]
        next_page = nearby(lat, lng, category, pagetoken=next_page_token)
        result['results'].extend(next_page)

    return result['results']


# Obtains details of a specific google place. User can determine fields of interest.
# all details are returned by default.
def details(place_id, fields=None):

    url = GOOG_DETAILS_ENDPOINT

    payload = {}
    headers = {}

    params = {
        'key': GOOG_KEY,
        'place_id': place_id
    }
    if fields:
        params['fields'] = fields

    response = requests.request(
        "GET", url, headers=headers, data=payload, params=params)
    response = json.loads(response.text)
    details = response['result']

    # TODO: perhaps want to smart search
    return details


# Similar to nearby search, but does search based on google text, and has a wider application
# of "types" than nearby(). for example, one can serach "apartments" which is not a google
# category to get the details that are needed
def search(lat, lng, query, radius=1, pagetoken=None):

    url = GOOG_TEXTSEARCH_ENDPOINT

    payload = {}
    headers = {}

    params = {
        'key': GOOG_KEY,
    }

    if pagetoken:
        params.update({
            'pagetoken': pagetoken
        })
    else:
        location = str(lat) + ',' + str(lng)
        radius = str(utils.miles_to_meters(radius))
        params.update({
            'location': location,
            'radius': radius,
            'query': query,
            'language': 'en',
            'rankby': 'prominence'
        })

    response = requests.request(
        "GET", url, headers=headers, data=payload, params=params)
    result = json.loads(response.text)

    # if new page request fails, try again until it completes
    if pagetoken and result['status'] == 'INVALID_REQUEST':
        time.sleep(1)
        next_page = search(lat, lng, query, pagetoken=pagetoken)
        result["results"].extend(next_page)

    # call to get he next page
    if "next_page_token" in result:
        next_page_token = result["next_page_token"]
        next_page = search(lat, lng, query, pagetoken=next_page_token)
        result['results'].extend(next_page)

    return result['results']


if __name__ == "__main__":

    def test_find():
        print(find('Spitz 371 E 2nd Street'))

    def test_nearby():
        item = nearby(34.0482327, -118.239857, 'restaurant')
        print(len(item))

    def test_details():
        place = find('Spitz 371 E 2nd Street')
        place_id = place['place_id']
        result = details(place_id, 'name')
        print(result['name'])

    def test_search():
        item = search(34.0482327, -118.239857, 'Apartments')
        print(item)
        print(len(item))
