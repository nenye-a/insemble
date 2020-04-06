from . import utils, landlord_matching
from bson import ObjectId
import data.api.google as google
import data.api.arcgis as arcgis
import data.api.environics as environics
import data.api.anmspatial as anmspatial
import data.api.spatial as spatial
from fuzzywuzzy import process


'''

Landlord Provider

This file will be the main provider of data and functions to the landlord api. This will be the main interface
between the actual api, and the actual underlying data infrastructure.

'''


def get_matching_tenants(eval_property, space_id):

    # grab my location details
    my_location = utils.DB_LOCATIONS.find_one({'_id': eval_property['location_id']})
    for item in eval_property['spaces']:
        if item['space_id'] == space_id:
            my_space = item

    tenants = utils.DB_BRANDS.find({
        "$or": [{
            "$or": [{'regions_present.regions': "California"}, {'regions_present.regions': "Nationwide"}],
        }, {
            "match_requests": {'$ne': []},
        }],
        'number_found_locations': {'$gt': 1},
        'average_arcgis_demographics.1mile': {'$ne': None},
        'average_environics_demographics.1mile': {'$ne': None},
        'average_spatial_psychographics.1mile': {'$ne': None}
    })
    tenant_dict = {tenant['brand_name']: tenant for tenant in tenants}
    match_list = list(tenant_dict.values()) + [my_location]
    matches = landlord_matching.generate_matches(match_list)

    final_matches = []
    for match in matches:

        brand = tenant_dict[match['brand_name']]
        name = brand['alias']
        match_value = match['match_value']

        # Factor in exclusives and targets
        categories = utils.flatten([[category['name'] for category in categories['categories']]
                                    for categories in brand['categories']])
        # break the loop if there's any exclusives.
        exclusive = None
        for eval_category in categories:
            exclusive = process.extractOne(eval_category, eval_property["exclusives"], score_cutoff=85)
            if exclusive:
                break
        if exclusive:
            continue

        for eval_category in categories:
            target = process.extractBests(eval_category, eval_property['target_tenant_categories'])
            if target:
                match_value * 1.04

        # Get the right categories
        category_dict = {
            category["source"]: category for category in brand["categories"]
        }
        try:
            if "Foursquare" in category_dict:
                category = category_dict["Foursquare"]['categories'][0]['name']
            elif "Crittenden" in category_dict:
                category = category_dict["Crittenden"]['categories'][0]['name']
            elif "Google" in category_dict:
                # Clean up google categories
                category = category_dict["Google"]['categories'][0]['name']
                category = " ".join([word.capitlize() for word in category.split('_')]).strip()
            else:
                category = ""
        except Exception:
            category = ""

        number_existing_locations = brand['number_found_locations']

        most_popular_store = utils.DB_PLACES.find({
            'brand_id': ObjectId(match['brand_id']),
            'popularity.source': "Google"
        }, {'photos.main': 1}).sort([('popularity.user_ratings_total', -1)])

        for store in most_popular_store:
            photo_url = store['photos']['main'] if 'main' in store['photos'] else None
            if photo_url:
                break

        contacts = brand['contacts'] if 'contacts' in brand and brand['contacts'] != [] else None

        interested = False
        has_requested_sqft = False

        if 'match_requests' in brand and len(brand['match_requests']) > 0:
            has_requested_sqft = True
            for match_request in brand['match_requests']:
                temp_match_value = match_value
                match_request = utils.DB_LOCATION_MATCHES.find_one({"_id": match_request['match_id']})
                sqft = match_request['params']['sqft']
                if sqft == {}:
                    has_requested_sqft = False
                    continue  # if sqft is empty, return
                matches_sqft = False
                square_foot_range = [sqft['min'], sqft['max'] or 200000]  # choosing an arbitrarily large integer
                if utils.in_range(my_space['sqft'], square_foot_range):
                    matches_sqft = True
                if matches_sqft:
                    temp_match_value = temp_match_value * 1.075
                elif len(sqft) > 0:
                    # match_value = match_value * 0.80 (instead of downranking the match, just eliminating it)
                    continue

                temp_match_value = min(max(temp_match_value, 10), 95)
                final_matches.append({
                    'name': name,
                    'match_value': temp_match_value,
                    'match_id': str(match_request['_id']),
                    'category': category,
                    'interested': interested,
                    'number_existing_locations': number_existing_locations,
                    'photo_url': photo_url,
                    'brand_id': match['brand_id'],
                    'onPlatform': False,          # TODO: add more details to onPlatform
                    'contacts': contacts
                })

        if 'typical_squarefoot' in brand and brand['typical_squarefoot'] and not has_requested_sqft:
            matches_sqft = False
            for ft in brand['typical_squarefoot']:
                # choosing an arbitrarily large integer
                square_foot_range = [ft['min'], ft['max'] or 200000]
                if utils.in_range(my_space['sqft'], square_foot_range):
                    matches_sqft = True
            if matches_sqft:
                match_value = match_value * 1.075
            elif len(brand['typical_squarefoot']) > 0:
                # match_value = match_value * 0.80 (instead of downranking the match, just eliminating it)
                continue

            # bound match value by 10 and 100%
            match_value = min(max(match_value, 10), 95)
            final_matches.append({
                'name': name,
                'match_value': match_value,
                'category': category,
                'interested': interested,
                'number_existing_locations': number_existing_locations,
                'photo_url': photo_url,
                'brand_id': match['brand_id'],
                'onPlatform': False,          # TODO: add more details to onPlatform
                'contacts': contacts
            })

    return final_matches


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

    if locations and locations.count() > 0:
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
