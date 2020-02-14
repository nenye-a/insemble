from . import utils, matching
import pandas as pd
import data.api.goog as google
import data.api.spatial as spatial
import data.api.arcgis as arcgis
import data.api.environics as environics

'''

This file will the main provider of key details that need to leverage the api. This will be the interface
between the main application api, and our calls data_api calls.

'''


# Return the location latitude and object details. Details are in the following form
# {lat:float, lng:float}
def get_location(address, name=None):
    return google.find(address, name, allow_non_establishments=True)['geometry']['location']


def get_key_facts(lat, lng):

    radius_miles = 1
    population_threshold = 100000

    # retrieve details for one mile. If they don't look satisfactory,
    # move on to three miles
    arcgis_details = arcgis.details(lat, lng, 1)

    if arcgis_details['DaytimePop'] < population_threshold:
        radius_miles = 3
        arcgis_details = arcgis.details(lat, lng, 3)

    num_metro = len(google.nearby(lat, lng, 'subway_station', radius=radius_miles))
    num_universities = len(google.nearby(lat, lng, 'university', radius=radius_miles))
    num_hospitals = len(google.nearby(lat, lng, 'hospital', radius=radius_miles))
    num_apartments = len(google.search(lat, lng, 'apartments', radius=radius_miles))

    return {
        'DaytimePop': arcgis_details['DaytimePop'],
        'MedHouseholdIncome': arcgis_details['MedHouseholdIncome'],
        'TotalHousholds': arcgis_details['TotalHouseholds'],
        'HouseholdGrowth2017-2022': arcgis_details['HouseholdGrowth2017-2022'],
        'num_metro': num_metro,
        'num_universities': num_universities,
        'num_hospitals': num_hospitals,
        'num_apartments': num_apartments
    }
