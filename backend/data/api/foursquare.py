from decouple import config
from . import safe_request

'''

All Foursquare related methods:

'''

API_NAME = "Foursquare"
FRSQ_ID = config("FRSQ_ID")
FRSQ_SECRET = config("FRSQ_SECRET")

# Foursquare endpoints, please refer to here:
# https://developer.foursquare.com/docs/api/endpoints
FRSQ_SEARCH_ENDPOINT = 'https://api.foursquare.com/v2/venues/search'


# find the foursquare details of the location at the specified latitude and longitude
def find(name, lat, lng, address):

    url = FRSQ_SEARCH_ENDPOINT
    payload = {}
    headers = {}
    params = {
        'll': str(lat) + ',' + str(lng),
        'intent': 'match',
        'name': name,
        'address': address,
        'client_id': FRSQ_ID,
        'client_secret': FRSQ_SECRET,
        'v': '20200125'
    }

    response, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='client_id,client_secret')

    if response is None or 'errorType' in response['meta']:
        print("Foursquare Error")
        return None

    if len(response['response']['venues']) == 0:
        return None
    place = response['response']['venues'][0]

    return place


if __name__ == "__main__":
    def test_find():
        find('Spitz', 34.048227, -118.239871, '371 E 2nd Street')

    test_find()
