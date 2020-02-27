from . import utils, matching
from django.conf import settings
import pandas as pd
from s3fs import S3FileSystem
import data.api.goog as google
import data.api.spatial as spatial
import data.api.arcgis as arcgis
import data.api.environics as environics

'''

Landlord focused matching algorithms. Functions almost entirely like the tenant matching provider,
but with some different sourcing techniques for landlord matching.

'''


def generate_matches(location_address, name=None, my_place_type={}):
    """

    Generates the matches for a landlord side user. Given the address of the location, this method will
    determine the most viable matches 

    -----------------------------------

    NOTE: In the short term this method will utilize the same matching DF and processes that the tenant
    side matching algorithm uses. In the ideal case, this method will likely leverage its very own matching
    dataframe that is based off the existing tenants, not just the tenants in a singular location.

    The item in the matching_df should include whether or not the location is from an actual tenant side user
    or a user mined off a seperate intent matcher.

    """

    landlord_vector_df = matching.generate_vector_address(location_address, None)
    info_df = matching.MATCHING_DF.copy().sample(300)  # TODO: remove temporary sample when using real data
    matching_df = info_df.drop(columns=["_id", "lat", "lng", "loc_id"])  # TODO: remove any tenant specific contextual columns
    matching_df = matching_df.append(landlord_vector_df)

    # fake options to get past options required on tenant matching
    options = {
        'desired_min_income': None,
        'desired_max_income': None,
        'desired_min_age': None,
        'desired_max_age': None,
        'desired_personas': [],
        'desired_commute': [],
        'desired_education': [],
        'desired_ethnicity': []
    }

    # Matching (currently leveraging the tenant matching algorithms heavily)
    print("Matching starting")
    matching_df = matching.preprocess_match_df(matching_df)
    matching_diff = matching_df.subtract(matching_df.iloc[-1]).iloc[:-1]
    matching_diff = matching.postprocess_match_df(matching_diff, options)  # TODO remove matching
    weighted_diff = matching.weight_and_evaluate(matching_diff)

    # Re-assign the tracking information. TODO: re-add any other removed contextual information
    weighted_diff['lat'] = info_df['lat']
    weighted_diff['lng'] = info_df['lng']
    weighted_diff['loc_id'] = info_df['loc_id']

    # Generate match values
    best = weighted_diff[weighted_diff['error_sum'] < .3].copy()
    best['match_value'] = best['error_sum'].apply(matching._map_difference_to_match)
    best['brand_id'] = best['loc_id'].apply(str)

    print("Returning Landlord Matches")

    # Return raw dataframe to be further processed in other methods
    return best[['match_value', 'brand_id']]


def generate_vector_address(address, name):
    return _generate_location_vector(address, name=name)


def generate_vector_location(lat, lng):
    return _generate_location_vector(None, lat=lat, lng=lng)


# Given an address, generates a vector of a location that can be used
# to compare against vectors stored in mongodb.
def _generate_location_vector(address, name=None, lat=None, lng=None):
    pass

# given a match dataframe, will preprocess into the correct format


def preprocess_match_df(dataframe):
    pass


# given difference matrix, post proesses items into groups that work together
def postprocess_match_df(difference_dataframe):
    pass


# will normalize, weight, and evaluate the vectors
def weight_and_evaluate(processed_difference_df):
    pass


def _map_difference_to_match(difference):
    pass
