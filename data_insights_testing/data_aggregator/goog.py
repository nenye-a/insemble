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


# Provided a location address & name, method corrects address if available in google. Method
# corrects address if available in google. Returns google place_id, geometry, address, & name
# If bias needed, please specific in bias field as per the google API
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

    # TODO: replace with some smart search when necessary
    response = requests.request(
        "GET", url, headers=headers, data=payload, params=params)

    # TODO: store requested location in mongo
    return json.loads(response.text)


# Given google place ID, can generate the other nearby locations.
# By defauly, algorithm returns all results in 3 miles up to 60.
def nearby(lat, lng, category, radius=3, pagetoken=None):

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
        next_page = nearby(lat, lng, category, pagetoken=pagetoken)
        result["results"].extend(next_page["results"])

    if "next_page_token" in result:
        next_page_token = result["next_page_token"]
        next_page = nearby(lat, lng, category, pagetoken=next_page_token)
        result["results"].extend(next_page["results"])

    return result


if __name__ == "__main__":

    def test_find():
        print(find('Spitz 371 E 2nd Street'))

    def test_nearby():
        item = nearby(34.0482327, -118.239857, 'restaurant')
        print(len(item['results']))
