'''

File for spatial analytics data processing

'''

import data.utils as utils
import data.mongo_connect as mongo_connect
# import pandas as pd

# get psychographics given lat and lng


def get_psychographics(lat, lng, radius, db_connection=utils.SYSTEM_MONGO):
    """
    Given a location (lat, lng) and a radius will return all the psychographic details for
    this location.
    """

    blockgroups = db_connection.get_collection(mongo_connect.AD_REGIONS).find({'type': 'blockgroup', 'location': {
        '$near': {
            '$geometry': {
                'type': "Point",
                'coordinates': [lng, lat]
            },
            '$maxDistance': utils.miles_to_meters(radius)
        }
    }, 'spatial_psychographics': {'$exists': True}})

    if blockgroups.count() == 0:
        print("No blockgroups with spatial data found!")
        return None

    blockgroups = list(blockgroups)

    total_weight = sum(blockgroup["spatial_psychographics"].pop("volume_percentile") for blockgroup in blockgroups)

    data = {}
    for psychographic in blockgroups[0]["spatial_psychographics"].keys():
        data[psychographic] = round(sum(item["spatial_psychographics"][psychographic] for item in blockgroups) / total_weight)

    return data
