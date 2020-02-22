import requests

'''

File will host all of the justice map api call methods.

'''

API_NAME = 'Justice_Map'

# Justice map endpoints. Refer to http://www.justicemap.org/include_map.php
JUSTICE_CENSUS_ENDPOINT = 'http://www.spatialjusticetest.org/api.php'


def details(lat, lng, radius):

    url = JUSTICE_CENSUS_ENDPOINT
    payload = {}
    headers = {}

    census_params = {
        'fLat': lat,
        'fLon': lng,
        'sGeo': 'block',
        'fRadius': radius,
        'sIntersect': 'contain'
    }

    income_params = census_params.copy()
    income_params.update({
        'sGeo': 'tract'
    })

    census_response = requests.request("GET", url, headers=headers, data=payload, params=census_params).json()
    income_response = requests.request("GET", url, headers=headers, data=payload, params=income_params).json()

    try:
        census_keys = ['asian', 'black', 'hispanic', 'indian', 'multi', 'white']
        census = {key: float(census_response[key]) for key in census_keys}

        median_population = census_response['pop'] if census_response['pop'] != '' else income_response['pop']
        median_income = income_response['income']

        response = {}
        response.update(census)
        response.update({
            'DaytimeResidentPop': median_population,
            'MedHouseholdIncome': median_income
        })

        print(response)
        return response

    except Exception:
        print("Data could not be returned")
        return None


if __name__ == "__main__":
    details(34.051694, -117.445533, 1)
