from . import utils, landlord_matching
from bson import ObjectId
import numpy as np
import re
import pandas as pd
import data.api.goog as google
import data.api.foursquare as foursquare
import data.api.arcgis as arcgis
import data.api.environics as environics


'''

Landlord Provider

This file will be the main provider of data and functions to the landlord api. This will be the main interface
between the actual api, and the actual underlying data infrastructure.

'''


def get_matching_tenants(address, sqft, rent=None, tenant_type=None, exclusives=None):
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
    best_matches["interested"][0] = True
    best_matches["matches_tenant_type"] = False
    best_matches["photo_url"] = best_matches["tenant_id"].apply(get_photos)

    return best_matches.to_json(orient='records')


def get_photos(location_id):

    space = utils.DB_PROCESSED_SPACE.find_one({'_id': ObjectId(location_id), 'photos.photo_reference': {'$exists': True}})
    if not space:
        return ""

    photo_reference = space['photos'][0]['photo_reference']
    return google.get_photo_url(photo_reference)
