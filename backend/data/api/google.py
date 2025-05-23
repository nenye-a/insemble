from decouple import config
import data.utils as utils
import urllib.parse
from . import safe_request

'''

All google related methods to confirm a location, and build dataset of all information needed.

'''

API_NAME = 'Google'
GOOG_KEY = config("GOOG_KEY")

# Google endpoints. Refer to https://developers.google.com/places/web-service/intro for details.
GOOG_FINDPLACE_ENDPOINT = 'https://maps.googleapis.DELETED_BASE64_STRING'
GOOG_NEARBY_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
GOOG_DETAILS_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/details/json'
GOOG_TEXTSEARCH_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
GOOG_GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'
GOOG_PLACE_PHOTOS_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/photo'

# Provided a location address & name, method corrects address if available in google. Method
# corrects address if available in google. Returns google place_id, geometry, address, & name
# If bias needed, please specific in bias field as per the google API


def find(address, name="", bias='ipbias', allow_non_establishments=False, save=True):

    url = GOOG_FINDPLACE_ENDPOINT
    payload = {}
    headers = {}
    params = {
        'key': GOOG_KEY,
        'input': address + name,
        'inputtype': 'textquery',  # text input
        'language': 'en',  # return in english
        'locationbias': bias,
        'fields': 'place_id,formatted_address,name,geometry,types,permanently_closed'
    }

    response, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key', safe=save)

    if response['status'] == 'ZERO_RESULTS':
        print('Zero results from google')
        return None

    place = response['candidates'][0]  # first candidate is the actual place

    if 'permanently_closed' in place or ('establishment' not in place['types'] and not allow_non_establishments):
        return None

    return place

# Provided a latitude and longitude, this endpoint will provide address including all address components:


def reverse_geocode(lat, lng, save=True):

    url = GOOG_GEOCODE_ENDPOINT
    payload = {}
    headers = {}

    latlng = str(lat) + ',' + str(lng)
    params = {
        'key': GOOG_KEY,
        'latlng': latlng,
    }

    result, _id = safe_request.request(API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key', safe=save)

    if 'status' in result:
        status = result['status']
        not_valid = status == "INVALID_REQUEST"
        is_denied = status == "REQUEST_DENIED"

        if not_valid or is_denied:
            utils.DB_REQUESTS[API_NAME].delete_one({'_id': _id})
            print("Request is Invalid")
            return None

    if 'results' not in result:
        print('Zero results from google')
        return None

    location = result['results'][0]

    return location


# Given google place ID, can generate the other nearby locations.
# By default, algorithm returns all results in 1 miles up to 60.
def nearby(lat, lng, category, radius=1, rankby='prominence', pagetoken=None, save=True):

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
            'type': category,
            'language': 'en',
            'rankby': rankby
        })
        if rankby == 'prominence':
            params['radius'] = radius

    result, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key', safe=save)

    # evaluate if call failed due to unstaged google next page. If so, try again
    # otherwise, return None. Proceed to check if there's a new page. Paths should
    # never be possible to occur at the same time but elif for extra safety
    next_page = None
    if not result:
        return None
    if result['status'] == 'INVALID_REQUEST':
        utils.DB_REQUESTS[API_NAME].delete_one({'_id': _id})
        if not pagetoken:
            return None
        next_page = nearby(lat, lng, category, pagetoken=pagetoken)
    elif "next_page_token" in result:
        next_page_token = result["next_page_token"]
        next_page = nearby(lat, lng, category, pagetoken=next_page_token)

    if next_page:
        result['results'].extend(next_page)

    return result['results']


# Obtains details of a specific google place. User can determine fields of interest.
# all details are returned by default.
def details(place_id, fields=None, save=True):

    url = GOOG_DETAILS_ENDPOINT

    payload = {}
    headers = {}

    params = {
        'key': GOOG_KEY,
        'place_id': place_id
    }
    if fields:
        params['fields'] = fields

    response, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key', safe=save)

    if response is None:
        return None

    if 'result' not in response:
        print(response)
        return None
    details = response['result'] if response else None

    return details


# Similar to nearby search, but does search based on google text, and has a wider application
# of "types" than nearby(). for example, one can serach "apartments" which is not a google
# category to get the details that are needed
def search(lat, lng, query, radius=1, pagetoken=None, save=True):

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

    result, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key', safe=save)

    next_page = None
    if result is None:
        return None
    if result['status'] == 'INVALID_REQUEST':
        utils.DB_REQUESTS[API_NAME].delete_one({'_id': _id})
        if not pagetoken:
            return None
        next_page = search(lat, lng, query, pagetoken=pagetoken)
    elif "next_page_token" in result:
        next_page_token = result["next_page_token"]
        next_page = search(lat, lng, query, pagetoken=next_page_token)

    if next_page:
        result['results'].extend(next_page)

    return result['results']


def portfolio(lat, lng, name, pagetoken=None):

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
        params.update({
            'location': location,
            'name': name,
            'language': 'en',
            'rankby': 'distance'
        })

    result, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key')

    # evaluate if call failed due to unstaged google next page. If so, try again
    # otherwise, return None. Proceed to check if there's a new page. Paths should
    # never be possible to occur at the same time but elif for extra safety
    next_page = None
    if not result:
        return None
    if result['status'] == 'INVALID_REQUEST':
        utils.DB_REQUESTS[API_NAME].delete_one({'_id': _id})
        if not pagetoken:
            return None
        next_page = portfolio(lat, lng, name, pagetoken=pagetoken)
    elif "next_page_token" in result:
        next_page_token = result["next_page_token"]
        next_page = portfolio(lat, lng, name, pagetoken=next_page_token)

    if next_page:
        result['results'].extend(next_page)

    return result['results']

# Get Photo URLS


def get_photo_url(photo_reference):

    params = {
        'key': GOOG_KEY,
        'photoreference': photo_reference,
        'maxheight': 1000
    }

    url = GOOG_PLACE_PHOTOS_ENDPOINT + '?' + urllib.parse.urlencode(params)
    return url


def get_photo(photo_reference):
    params = {
        'key': GOOG_KEY,
        'photoreference': photo_reference,
        'maxheight': 1000
    }

    payload = {}
    headers = {}

    url = GOOG_PLACE_PHOTOS_ENDPOINT

    result, _id = safe_request.request(API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key')

    if result is None:
        return None

    return result
