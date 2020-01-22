from decouple import config
import requests


'''

File for gecoding library provided by texas a&m

'''

ANM_KEY = config('ANM_KEY')

# To see the documentation for the anm point in polygon api, please refer to the following:
# https://geoservices.tamu.edu/Services/CensusIntersection/WebService/v04_01/Rest.aspx

ANM_CENSUS_INTERSECTION_ENDPOINT = 'https://geoservices.tamu.edu/Services/CensusIntersection/WebService/v04_01/Rest/'
ANM_PARSER_VERSION = '4.01'  # parser version detailed in documentation
CENSUS_YEAR = '2010'


# Converts point on map to 2010 census blockgroup. Provide state
# to increase processing speed - form XX, ex. CA for california.
# Set prune_leading_zero to False if you wish to keep the zero.
def point_to_block_group(lat, lng, state=None, prune_leading_zero=True):

    url = ANM_CENSUS_INTERSECTION_ENDPOINT
    payload = {}
    headers = {}
    params = {
        'apiKey': ANM_KEY,
        'version': ANM_PARSER_VERSION,
        'censusYear': CENSUS_YEAR,
        'lat': str(lat),
        'lon': str(lng),
        'format': 'json',
    }
    if state:
        params['s'] = state

    response = requests.request(
        "GET", url, headers=headers, data=payload, params=params
    ).json()

    # first record is the actual result
    record = response['CensusRecords'][0]
    block_group = record['CensusStateFips'] + record['CensusCountyFips'] + \
        record['CensusTract'] + record['CensusBlockGroup']

    # Remove any periods in the block group
    block_group = block_group.replace('.', '')

    # If the first number starts with 0, remove it
    if prune_leading_zero and block_group[0] == '0':
        block_group = block_group[1:]

    return block_group


if __name__ == "__main__":

    def test_point_to_block_group():
        print(point_to_block_group(34.056180, -118.276855, state='CA'))

    test_point_to_block_group()
