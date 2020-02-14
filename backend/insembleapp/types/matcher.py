# import json
from bson import ObjectId
from mongo_connect import Connect
import sys
from django.conf import settings
sys.path.append(settings.INSIGHTS_DIR)


'''

File for handling matching between tenants and properties.

'''

# Test database for initial function
MATCH_DATABASE = Connect.get_connection().Matches.Test
SPACES_DATABASE = Connect.get_connection().spaceData.spaces


# Temporary poster to create space in the database for a profile to be used.
def temp_generate_profile_matches(data):
    """
    Provided input data, provides database id referring back to field.
    Data expected to have the following fields.

    ID will be stock ID as recorded by MongoDB -> Bson ObjectID.
    """

    # The following is a very simple algorithm using existing data to generate dynamic matches that are asigned
    # to specific match profiles in our database. Methodology is simple:
    #
    # Filter database by properties within 2% of the income with the same primary category, then filtered on rating.
    # Currently, we utilize categories using foursquare - List of categories can be found here:
    # https://developer.foursquare.com/docs/resources/categories
    #
    # 4 of these will be represented as "locations of matching properties

    match_size = 100

    upper_income = data['target_income']['max']
    lower_income = data['target_income']['min']
    # target_category = data['categories']

    query = {
        'arcgis_details1.MedHouseholdIncome1': {
            '$lt': upper_income,
            '$gt': lower_income
        },
        # 'foursquare_categories.0.category_name': target_category,
        'rating': {'$gt': 4.2}
    }

    matching_spaces = SPACES_DATABASE.aggregate([
        {'$match': query},
        {'$sample': {'size': match_size}}
    ])

    # convert cursor to list of items & generate Customer rating
    matching_spaces = [space for space in matching_spaces]
    for space in matching_spaces:
        space['match'] = _rating_to_match(space['rating'])

    # consider the first 4 matches (if real)
    matching_properties = matching_spaces[:4]

    profile_matches = {
        'input_details': data,
        'matching_properties': matching_properties,
        'matching_spaces': matching_spaces,
    }

    # return none if there's a failure
    try:
        mongo_id = MATCH_DATABASE.insert(profile_matches)
    except:
        return None

    return str(mongo_id)


# Temporary file to retrive profile matches
def temp_retrieve_profile_matches(_id):

    _id = ObjectId(_id)
    matches = MATCH_DATABASE.find_one({'_id': _id})

    if matches is None:
        return {}
    else:
        matches['_id'] = str(matches['_id'])
        for item in matches['matching_properties']:
            item['_id'] = str(item['_id'])
        for item in matches['matching_spaces']:
            item['_id'] = str(item['_id'])
        return matches


# Takes a rating from 0 to 5 and maps to match between 60 and 100
def _rating_to_match(rating):
    _translate(rating, 0, 5, 60, 100)


def _translate(value, left_min, left_max, right_min, right_max):

    left_span = left_max - left_min
    right_span = right_max - right_min
    value_scaled = float(value - left_min) / float(left_span)
    return right_min + (value_scaled * right_span)

# class JSONEncoder(json.JSONEncoder):
#     def default(self, o):
#         if isinstance(o, ObjectId):
#             return str(o)
#         return json.JSONEncoder.default(self, o)
