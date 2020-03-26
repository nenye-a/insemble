'''

File for ArcGIS & ESRI data processing

'''

import requests
import json
from decouple import config

# TODO: get permanent token. This may fail eventually
url = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/enrich"
TOKEN = config("ARCGIS_TOKEN")


def details(lat, lng, radius):

    payload = "f=json&token={}&inSR=4326&outSR=4326&returnGeometry=true&studyAreas=%5B%0A%20%20%7B%0A%20%20%20%20%22geometry%22%3A%7B%0A%20%20%20%20%20%20%22x%22%3A{}%2C%0A%20%20%20%20%20%20%22y%22%3A{}%0A%20%20%20%20%7D%0A%20%20%7D%0A%5D&studyAreasOptions=%7B%0A%20%20%22areaType%22%3A%22RingBuffer%22%2C%0A%20%20%22bufferUnits%22%3A%22esriMiles%22%2C%0A%20%20%22bufferRadii%22%3A%5B{}%5D%0A%7D&dataCollections=%5B%22KeyGlobalFacts%22%2C%20%22KeyUSFacts%22%5D".format(
        TOKEN, lng, lat, radius)

    headers = {
        'Content-Type': "application/x-www-form-urlencoded",
        'User-Agent': "PostmanRuntime/7.20.1",
        'Accept': "*/*",
        'Cache-Control': "no-cache",
        'Postman-Token': "67493b91-fac6-4da0-831c-22fd81bdf392,6eefa3ba-8aec-4f05-884c-dc1566a5c7b2",
        'Host': "geoenrich.arcgis.com",
        'Accept-Encoding': "gzip, deflate",
        'Content-Length': "692",
        'Connection': "keep-alive",
        'cache-control': "no-cache"
    }

    # explanations within API response

    response = requests.request("POST", url, data=payload, headers=headers)
    data = json.loads(response.text)
    try:
        attributes = data["results"][0]["value"]["FeatureSet"][0]["features"][0]["attributes"]
        daytime_pop = attributes["DPOP_CY"]
        daytime_working_pop = attributes["DPOPWRK_CY"]
        daytime_resident_pop = attributes["DPOPRES_CY"]
        num_households = attributes["TOTHH"]
        households_growth = attributes["HHGRWCYFY"]
        household_income = attributes["MEDHINC_FY"]
    except:
        print('Failed to obtain ArcGIS detials')
        return None

    info = {"DaytimePop": daytime_pop, "DaytimeWorkingPop": daytime_working_pop, "DaytimeResidentPop": daytime_resident_pop,
            "TotalHouseholds": num_households, "HouseholdGrowth2017-2022": households_growth, "MedHouseholdIncome": household_income}

    return info
