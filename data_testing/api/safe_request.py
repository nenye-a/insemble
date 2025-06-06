import sys
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)  # include data_testing

import utils
import requests
import time


'''

This file processes requests to each of the host APIs, referring to the database to determine
if this call has been made previously.

'''

API_KEY_MASK = 'API_KEY_MASK'

# executable request method


def request(api_name, req_type, url, headers={}, data={}, params={}, api_field=None, safe=True):
    """

    Method recieves typical request fields & checks that database to ensure
    that they haven't been performed.

    api_name: name of the api being requested
    req_type: HTTP request - "GET","POST","PUT","DELETE","UPDATE", etc.
    url: endpoint of request
    headers: headers of file
    data: payload
    params: parameters that will be programatically appended to request
    api_field: field within headers or params that contains the api key and should be masked. If
               there are multiple, they should be seperated by comma

    """

    # connect to api specific database
    api_db = utils.DB_REQUESTS[api_name]
    utils.db_index(api_db, 'req_type', 'url',
                   'masked_params', 'masked_headers', unique=True)

    # mask api_field for all calls
    masked_headers = headers.copy()
    masked_params = params.copy()
    if api_field:
        api_fields = api_field.split(',')
        for field in api_fields:
            if field in headers:
                masked_headers[field] = API_KEY_MASK
            if field in params:
                masked_params[field] = API_KEY_MASK

    api_request = {
        'req_type': req_type,
        'url': url,
        'masked_params': masked_params,
        'masked_headers': masked_headers,
    }

    # search in internal databases
    search = utils.DB_REQUESTS[api_name].find_one(api_request)

    # If search exists, return it's results
    if search is not None:
        print('Saving Money on {} calls'.format(api_name))
        return (search['response'], search['_id'])

    # otherwise, call the api directly & store result
    try:
        response = requests.request(
            req_type, url, headers=headers, data=data, params=params)
        if "https://maps.googleapis.com/maps/api/place/photo" in url:
            response = response.url  # special case for google photos
        else:
            response = response.json()
    except requests.exceptions.ConnectionError:
        retry_couter = 0
        print('Failed to connect, retrying call on {} API'.format(api_name))
        while retry_couter < 3:
            print('Retry attempt {}'.format(retry_couter + 1))
            response = requests.request(
                req_type, url, headers=headers, data=data, params=params)
            if "https://maps.googleapis.com/maps/api/place/photo" in url:
                response = response.url  # special case for google photos
            else:
                response = response.json()
            if response:
                print('Successful retry on attempt {}'.format(retry_couter + 1))
                break
            elif retry_couter == 2:
                print('Retries unsuccessful, returning None.')
                return None, None

    api_request['response'] = response

    # try to input into the database. If someone input concorrently, still return the actual _id
    if safe:
        try:
            _id = utils.DB_REQUESTS[api_name].insert(api_request)
        except:
            time.sleep(1.5)
            search = utils.DB_REQUESTS[api_name].find_one(api_request)
            if search is not None:
                return search['response'], search['_id']
            else:
                return None, None
    else:
        _id = None

    return (response, _id)


if __name__ == "__main__":
    pass
