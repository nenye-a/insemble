from decouple import config
import data.utils as utils
import safe_request
import time

'''

Pitney Bose algorithms to get an index of all available locations within a region.

'''

API_NAME = 'Pitney_Bose'
#PITNEY_KEY = config('PITNEY_KEY')
PITNEY_KEY = "Bearer srYq7EJLLQXG0IgnvD9AsTVVc5cY"
GOOG_KEY = config("GOOG_KEY")

# Please note that poi == "Point Of Interest". To see the documentation for the pitney bowes
# api, please refer here:
# https://locate.pitneybowes.com/docs/location-intelligence/v1/en/index.html#About%20Document/about_this_document.html

PITNEY_BY_AREA_SEARCH_ENDPOINT = 'https://api.pitneybowes.com/location-intelligence/geoenrich/v1/poi/byarea'
PITNEY_BY_ADDRESS_SEARCH_ENDPOINT = 'https://api.pitneybowes.com/location-intelligence/geoenrich/v1/poi/byaddress'


# Generates all the points of interest within an area that can be evaluated.
def poi_within_area(country, state, city, zip_code=None, sic_codes=None,
                    type_=None, max_results=None, page=1):
    """

    Retrieves all the locations within an area as indicated above.
    Most parameters are self explanatory but here are the details
    of those that are not. By default, zip code is not needed.

    sic_codes: The SIC codes are unique 4 or 8 digit SIC codes. These indicate the
          service of use that we filter for. Endpoint can only handle a max
          of 10 of these. List of all sic codes can be found here: 
          https://locate.pitneybowes.com/downloads/location-intelligence/v1/SICCodes.xlsx

          format: comma seperated fix, ex: '5651,5661,5712,5734'

    type_: The types refer to the the type of the store that this request is making. Generally
           the only types that we will refer to are 'store' & 'restaurant'. Types should be
           provided in the same way as sic codes. 

           format: 'store,restaurant'

    max_results: The maximum amount of results that are desired by
          the caller. This can be any number. Without any number specified,
          the code will only return 100 results. If the user specifies the
          string term 'all' then the method will return all abvailable records.
          Results can only be returned in increments of 100, so a request for
          230 records will result in 300 being returned.

    page: The Pitney_bowes page to start the algorithm on. Pages have at maximum 100 records 

    """

    url = PITNEY_BY_AREA_SEARCH_ENDPOINT
    max_pois_per_page = 100  # cannot exceed 100 for JSON output

    payload = {}
    headers = {
        'Authorization': PITNEY_KEY
    }
    params = {
        'country': country,
        'areaName1': state,
        'areaName3': city,
        'page': page,
        'maxCandidates': max_pois_per_page
    }

    if zip_code:
        params['postcode1'] = zip_code
    if sic_codes:
        params['sicCode'] = sic_codes
    if type_:
        params['type'] = type_

    result, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='Authorization')

    # print(result)  # debug statuement

    if 'poi' not in result:
        utils.DB_REQUESTS[API_NAME].delete_one({'_id': _id})
        if 'errors' in result:
            if result['errors'][0]['errorCode'] == 'PB-14020-GEOENRICH-0024':
                print('No more results for this query')
                return [], page
            if result['errors'][0]['errorCode'] == 'PB-14020-GEOENRICH-0031':
                print('Ended before reaching all results')
                return [], page
            print('Other Error')
            return None
        return None

    # Determine what the true max results are based on settings & availability
    total_num_of_pois = int(result['totalMatchingCandidates'])
    max_results = min(
        total_num_of_pois, max_results) if max_results != 'all' else total_num_of_pois

    # If we have more results to get, recursively get the next page
    if page * max_pois_per_page < max_results:
        page += 1
        time.sleep(0.25)  # time just to not DDOS API
        next_page = poi_within_area(country, state, city, zip_code=zip_code,
                                    sic_codes=sic_codes, type_=None, max_results=max_results, page=page)
        if next_page[0]:
            result['poi'].extend(next_page[0])
            page = next_page[1] + 1
    else:
        page += 1

    return result['poi'], page


def get_sales(address, name, country='USA'):
    GOOG_FINDPLACE_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
    url = PITNEY_BY_ADDRESS_SEARCH_ENDPOINT

    payload = {}
    headers = {
        'Authorization': PITNEY_KEY
    }

    # loop thru all pages
    page_num = 1
    max_can = 100
    while True:

        params = {
            'country': country,
            'address': address,
            'name': name,
            'maxCandidates': max_can,
            'page': page_num
        }

        result, _id = safe_request.request(
            API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='Authorization')

        if 'poi' not in result:
            utils.DB_REQUESTS[API_NAME].delete_one({'_id': _id})
            if 'errors' in result:
                print("No pitney match found, error noticed.")
            print("No pitney match found")
            return None

        for poi in result["poi"]:
            poss_address = poi["contactDetails"]["address"]["formattedAddress"]

            url = GOOG_FINDPLACE_ENDPOINT
            payload = {}
            headers = {}
            params = {
                'key': GOOG_KEY,
                'input': poss_address,
                'inputtype': 'textquery',  # text input
                'language': 'en',  # return in english
                'fields': 'formatted_address'
            }

            response, _id = safe_request.request(
                API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key')

            try:
                print("   poss google address",
                      response["candidates"][0]['formatted_address'])
            except:
                pass

            if len(response["candidates"]) != 0 and response["candidates"][0]['formatted_address'] == address:
                return poi.get('salesVolume', [{}])[0].get('value', None)

        # page number shit
        if page_num * max_can >= int(result["totalMatchingCandidates"]):
            break
        page_num += 1

    # no sales volume found
    return None


if __name__ == "__main__":

    def test_poi_within_area():
        result = poi_within_area(
            'USA', 'CA', 'Los Angeles', sic_codes='5651,5661,5712,5734', max_results=600)
        print(len(result[0]))
        print(result[1])

    # test_poi_within_area()

    get_sales("327 1/2 E 1st St, Los Angeles, CA 90012", "Little Tokyo Hotel")
