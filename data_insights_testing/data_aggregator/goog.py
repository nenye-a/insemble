from decouple import config
import requests
import json

'''

All google related methods to build locations

'''

GOOG_KEY = config("GOOG_KEY")

# Google endpoints. Refer to https://developers.google.com/places/web-service/intro for details.
GOOG_FINDPLACE_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
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
    response = requests.request("GET", url, headers=headers, data=payload, params=params)
    return json.loads(response.text)

def nearby():

    return "INCOMPLETE"


def nearby_stores():
    return "INCOMPLATE"


def nearby_office():
    return "INCOMPLETE"


def nearby_university():
    return "INCOMPLETE"


def nearby_hospitals():
    return "INCOMPLETE"


def nearby_garages():
    return "INCOMPLETE"

# if __name__ == "__main__":
#     print(find('Spitz 371 E 2nd Street'))