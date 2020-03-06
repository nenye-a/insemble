from . import utils, landlord_matching
from bson import ObjectId
import numpy as np
import pprint
import re
import pandas as pd
import data.api.goog as google
import data.api.foursquare as foursquare
import data.api.arcgis as arcgis
import data.api.environics as environics
import data.api.anmspatial as anmspatial
import data.api.spatial as spatial
from bson import ObjectId


'''

Landlord Provider

This file will be the main provider of data and functions to the landlord api. This will be the main interface
between the actual api, and the actual underlying data infrastructure.

'''


def get_matching_tenants(address):  # , sqft, rent=None, tenant_type=None, exclusives=None):
    """

    Return the matching tenants for a landlord factoring all aspects of the match, including a
    filter based on square footage, rent, and tenant_type

    """

    # get dataframe of the best tenants, including all contextual information
    best_matches = landlord_matching.generate_matches(address)

    # TODO: filter by square footage (when available)
    # TODO: filter by rent (when available)
    # TODO: mark as within tenant_type and exclusives (existing tenant category should be factored in)

    # Spoof results until we have database connections to do real connections.
    best_matches["name"] = "Test"
    best_matches["category"] = "Mexican Restaurant"
    best_matches["num_existing_locations"] = 10
    best_matches["on_platform"] = True
    best_matches["interested"] = False
    best_matches["verified"] = False
    best_matches["claimed"] = False
    best_matches["matches_tenant_type"] = False
    best_matches["photo_url"] = best_matches["brand_id"].apply(get_photos)

    return best_matches.to_dict(orient='records')


def get_photos(location_id):

    space = utils.DB_PROCESSED_SPACE.find_one({'_id': ObjectId(location_id), 'photos.photo_reference': {'$exists': True}})
    if not space:
        return ""

    photo_reference = space['photos'][0]['photo_reference']
    return google.get_photo_url(photo_reference)


def get_property(property_id):
    return utils.DB_PROPERTY.find_one({'_id': ObjectId(property_id)})


def build_location(lat, lng):
    """
    Provided a latitude and longitude, grabs the nearest location with details. If one does not exist it just generates
    one entirely new.
    """
    max_distance = 0.10

    locations = utils.DB_LOCATIONS.find({'location': {
        '$near': {
            '$geometry': {
                'type': 'Point',
                'coordinates': [lng, lat]
            },
            '$maxDistance': utils.miles_to_meters(max_distance)
        }
    }})

    if locations:
        # return the closest location, as near returns the items sorted by distance
        return list(locations)[0]

    block = anmspatial.point_to_block(lat, lng, state='CA', prune_leading_zero=False)
    blockgroup = block[:-3] if block else None
    tract = block[:-4] if block else None
    # return the built locationlocation
    return {
        'location': {
            'type': "Point",
            'coordinates': [lng, lat]
        },
        'block': block,
        'blockgroup': blockgroup,
        'tract': tract,
        'environics_demographics': {
            '1mile': environics.get_demographics(lat, lng, 1),
            '3mile': environics.get_demographics(lat, lng, 3),
            '5mile': environics.get_demographics(lat, lng, 5)},
        'spatial_psychographics': {
            '1mile': spatial.get_psychographics(lat, lng, 1),
            '3mile': spatial.get_psychographics(lat, lng, 3),
            '5mile': spatial.get_psychographics(lat, lng, 5)
        },
        'arcgis_demographics': {
            '1mile': arcgis.details(lat, lng, 1),
            '3mile': arcgis.details(lat, lng, 3)
        }
    }


def add_property(property_params, space_params):

    property_params['spaces'] = []
    space_id = ObjectId()
    space_params['id'] = space_id
    property_params['spaces'].append(space_params)

    return str(utils.DB_PROPERTY_LEGACY.insert(property_params)), str(space_id)


def update_property_with_id(property_id, space_params):

    space_id = ObjectId()
    space_params['id'] = space_id
    this_property = utils.DB_PROPERTY_LEGACY.find_one({'_id': ObjectId(property_id)}, {'spaces': 1})
    this_property['spaces'].append(space_params)
    utils.DB_PROPERTY_LEGACY.update_one({'_id': ObjectId(property_id)}, {'$set': this_property})
    return str(space_id)


def property_details(property_id):

    return utils.DB_PROPERTY_LEGACY.find_one({"_id": ObjectId(property_id)})["location_details"]


def property_address(property_id):

    return utils.DB_PROPERTY_LEGACY.find_one({"_id": ObjectId(property_id)})["address"]


def tenant_details(tenant_id):

    return utils.DB_PROCESSED_SPACE.find_one({"_id": ObjectId(tenant_id)})
