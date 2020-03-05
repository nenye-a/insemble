'''

File for environics data processing. 

'''

import data.utils as utils
# import pandas as pd


WEIGHTED_CATEGORIES = ["Current Year Median Age", "Current Year Average Age", "Current Year Median Household Income", "Current Year Average Household Income",
                       "Current Year Median Household Effective Buying Income", "Current Year Average Household Effective Buying Income",
                       "Five Year Median Household Income", "Five Year Average Household Income"]


def get_demographics(lat, lng, radius):
    """
    Get all the environics data for a latitude and longitude and radius.
    """

    blockgroups = utils.DB_REGIONS.find({'type': 'blockgroup', 'location': {
        '$near': {
            '$geometry': {
                'type': "Point",
                'coordinates': [lng, lat]
            },
            '$maxDistance': utils.miles_to_meters(radius)
        }
    }, 'environics_demographics': {'$exists': True}})

    if blockgroups.count() == 0:
        print("No blockgroups with environics data found!")
        return None

    blockgroups = list(blockgroups)

    # weight and add the median and averages
    total_population = round(sum(item["environics_demographics"]["Current Year Population, Gender"]["Current Year Population, Male"] +
                                 item["environics_demographics"]["Current Year Population, Gender"]["Current Year Population, Female"] for item in blockgroups))

    data = {}
    for demo_category in blockgroups[0]["environics_demographics"].keys():

        if isinstance(blockgroups[0]["environics_demographics"][demo_category], dict):
            data[demo_category] = {}
            for demo_sub_category in blockgroups[0]["environics_demographics"][demo_category]:
                data[demo_category][demo_sub_category] = round(sum(item["environics_demographics"]
                                                                   [demo_category][demo_sub_category] for item in blockgroups))
        else:
            if demo_category in WEIGHTED_CATEGORIES:
                data[demo_category] = 0
                for item in blockgroups:
                    population = item["environics_demographics"]["Current Year Population, Gender"]["Current Year Population, Male"] + \
                        item["environics_demographics"]["Current Year Population, Gender"]["Current Year Population, Female"]
                    weight = population / total_population
                    data[demo_category] += weight * item["environics_demographics"][demo_category]
                data[demo_category] = round(data[demo_category])
            else:
                data[demo_category] = round(sum(item["environics_demographics"][demo_category] for item in blockgroups))

    return data
