import utils
import requests


'''

This file processes requests to each of the host APIs, referring to the database to determine
if this call has been made previously.

'''

API_KEY_MASK = 'API_KEY_MASK'

# executable request method


def request(api_name, req_type, url, headers={}, data={}, params={}, api_field=None):
    """

    Method recieves typical request fields & checks that database to ensure
    that they haven't been performed.

    api_name: name of the api being requested
    req_type: HTTP request - "GET","POST","PUT","DELETE","UPDATE", etc.
    url: endpoint of request
    headers: headers of file
    data: payload
    params: parameters that will be programatically appended to request
    api_field: field within headers or params that contains the api key and should be masked

    """

    # connect to api specific database
    api_db = utils.DB_REQUESTS[api_name]
    utils.unique_db_index(api_db, 'req_type', 'url',
                          'masked_params', 'masked_headers')

    # mask api_field for all calls
    masked_headers = headers.copy()
    masked_params = params.copy()

    if api_field in headers:
        masked_headers[api_field] = API_KEY_MASK
    if api_field in params:
        masked_params[api_field] = API_KEY_MASK

    api_request = {
        'req_type': req_type,
        'url': url,
        'masked_params': masked_params,
        'masked_headers': masked_headers,
    }

    # search in internal databases
    search = utils.DB_REQUESTS[api_name].find_one(api_request)

    # If search exists, return it's results
    if search != None:
        return (search['response'], search['_id'])

    # otherwise, call the api directly & store result
    response = requests.request(
        req_type, url, headers=headers, data=data, params=params).json()
    api_request['response'] = response

    _id = utils.DB_REQUESTS[api_name].insert(api_request)

    return (response, _id)


if __name__ == "__main__":
    pass
