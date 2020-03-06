from . import utils, matching
from django.conf import settings
import pandas as pd
from s3fs import S3FileSystem
import data.api.goog as google
import data.api.spatial as spatial
import data.api.arcgis as arcgis
import data.api.environics as environics
from decouple import config

'''

Landlord focused matching algorithms. Functions almost entirely like the tenant matching provider,
but with some different sourcing techniques for landlord matching.

'''

AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY")

S3_FILESYSTEM = S3FileSystem(
    key=AWS_ACCESS_KEY_ID, secret=AWS_SECRET_ACCESS_KEY)

COLUMN_MIN_MAX_DF = utils.read_dataframe_csv(
    'insemble-dataframes/match_stats.csv.gz', file_system=S3_FILESYSTEM)


def generate_matches(locations):
    """

    Generates the matches for a landlord side user. Given the address of the location, this method will
    determine the most viable matches. This will assume that the landlords property is the last element
    in the locations list.
    """

    info_df = generate_match_df(locations)
    match_df = info_df.drop(columns=['_id', 'brand_name'])
    print("** Landlord Matching: Pre-processing start.")
    prepared_match_df = matching.preprocess_match_df(match_df.fillna(0)).fillna(0)
    match_diff = prepared_match_df.subtract(prepared_match_df.iloc[-1]).iloc[:-1]
    print("** Landlord Matching: Post-processing start.")
    match_diff = postprocess_match_df(match_diff)
    print("** Matching: Evaluation Ongoing.")
    weighted_df = weight_and_evaluate(standardize(match_diff))

    weighted_df['brand_id'], weighted_df['brand_name'] = info_df['_id'], info_df['brand_name']
    print("** Landlord Matching: Matching complete, results immenent.")

    # Showing all, no need to take the best
    weighted_df['brand_id'] = weighted_df['brand_id'].apply(str)
    weighted_df['match_value'] = weighted_df['error_sum'].apply(matching._map_difference_to_match)

    return weighted_df[['match_value', 'brand_id', 'brand_name']].to_dict(orient='records')


def get_location_dictionary(location):
    """
    Provided a location from the mongdb database, will generate an updated vector with the latest details.
    """
    if 'average_spatial_psychographics' in location:
        psycho_dict = location['average_spatial_psychographics']['1mile'] or {}
        psycho_dict3 = location['average_spatial_psychographics']['3mile'] or {}
        arcgis_dict = location['average_arcgis_demographics']['1mile'] or {}
        arcgis_dict3 = location['average_arcgis_demographics']['3mile'] or {}
        demo_dict = location['average_environics_demographics']['1mile'] or {}
        demo_dict3 = location['average_environics_demographics']['3mile'] or {}
    else:
        psycho_dict = location['spatial_psychographics']['1mile'] or {}
        psycho_dict3 = location['spatial_psychographics']['3mile'] or {}
        arcgis_dict = location['arcgis_demographics']['1mile'] or {}
        arcgis_dict3 = location['arcgis_demographics']['3mile'] or {}
        demo_dict = location['environics_demographics']['1mile'] or {}
        demo_dict3 = location['environics_demographics']['3mile'] or {}

    nearby_store = location['nearby_store'] if 'nearby_store' in location else None
    nearby_restaurant = location['nearby_resturant'] if 'nearby_restaurant' in location else None
    # CREATE ARRAY AS DATAFRAME (for 1 MILE)
    # create psychographic dataframe

    # arcgis - num households, daytime pop, daytime working pop, income, etc.
    arcgis_dict = {key + "1": value for key, value in arcgis_dict.items()}
    arcgis_dict["HouseholdGrowth2017-2022-1"] = arcgis_dict.pop(
        "HouseholdGrowth2017-20221")

    # demo - gender, race, age, travel time, transport methods
    if demo_dict != {}:
        gender_dict = demo_dict["Current Year Population, Gender"] or {}
        race_dict = demo_dict["Current Year Population, Race"] or {}
        age_dict = demo_dict["Current Year Population, Age"] or {}
        education_dict = demo_dict["Current Year Population 25+, Education"] or {}
        transport_dict = demo_dict["Current Year Workers, Transportation to Work"] or {}
        travel_time_dict = demo_dict["Current Year Workers, Travel Time To Work"] or {}
        income_dict = demo_dict["Current Year Households, Household Income"] or {}
    else:
        gender_dict = {}
        race_dict = {}
        age_dict = {}
        education_dict = {}
        transport_dict = {}
        travel_time_dict = {}
        income_dict = {}

    # add the 1 mile values
    vector_dict = dict(psycho_dict, **arcgis_dict, **gender_dict, **race_dict, **age_dict,
                       **education_dict, **transport_dict, **travel_time_dict, **income_dict)

    # CREATE ARRAY AS DATAFRAME (for 3 MILE)
    psycho_dict3 = {key + "3": value for key, value in psycho_dict3.items()}
    arcgis_dict3 = {key + "13": value for key, value in arcgis_dict3.items()}
    arcgis_dict3["HouseholdGrowth2017-2022-13"] = arcgis_dict3.pop(
        "HouseholdGrowth2017-202213")
    # demo - gender, race, age, travel time, transport methods

    if demo_dict != {}:
        gender_dict3 = {key + "3": value for key, value in demo_dict3["Current Year Population, Gender"].items()}
        race_dict3 = {key + "3": value for key, value in demo_dict3["Current Year Population, Race"].items()}
        age_dict3 = {key + "3": value for key, value in demo_dict3["Current Year Population, Age"].items()}
        education_dict3 = {key + "3": value for key, value in demo_dict3["Current Year Population 25+, Education"].items()}
        transport_dict3 = {key + "3": value for key, value in demo_dict3["Current Year Workers, Transportation to Work"].items()}
        travel_time_dict3 = {key + "3": value for key, value in demo_dict3["Current Year Workers, Travel Time To Work"].items()}
        income_dict3 = {key + "3": value for key, value in demo_dict3["Current Year Households, Household Income"].items()}
    else:
        gender_dict3 = {}
        race_dict3 = {}
        age_dict3 = {}
        education_dict3 = {}
        transport_dict3 = {}
        travel_time_dict3 = {}
        income_dict3 = {}
    # add the 3 mile values
    vector_dict = dict(vector_dict, **psycho_dict3, **arcgis_dict3, **gender_dict3, **race_dict3, **age_dict3,
                       **education_dict3, **transport_dict3, **travel_time_dict3, **income_dict3)

    # add and evaluate all the nearby stores and restaurants to the array.
    # TODO: make less redundant (same method for restaurant and store)

    categories = {}
    for nearby in [nearby_store, nearby_restaurant]:
        if nearby:
            for place in nearby_store:
                category_list = place.get("foursquare_categories", [{"category_name": None}])
                if len(category_list) == 0:
                    continue
                category = category_list[0]["category_name"]
                if category:
                    categories[category] = categories.get(category, 0) + 1

    # add the categories to the dict
    vector_dict.update(categories)
    vector_dict['_id'] = location['_id']
    vector_dict['brand_name'] = location['brand_name']

    return vector_dict


def generate_match_df(locations):
    """
    Provided a list of locations from the mongdb database, will generate a set of vectors.
    If provided a regular location, will return the vector.
    """

    if isinstance(locations, list):
        list_dict = [get_location_dictionary(location) for location in locations if location]
        return pd.DataFrame(list_dict)
    elif isinstance(locations, dict):
        return pd.DataFrame([get_location_dictionary(locations)])
    else:
        # Item should either be a location dictionary or a list of location dictrionaries
        return None


# given a match dataframe, will preprocess into the correct format


def preprocess_match_df(dataframe):
    pass


# given difference matrix, post proesses items into groups that work together
def postprocess_match_df(difference_dataframe):

    difference_dataframe = difference_dataframe.abs()

    difference_dataframe["psycho"] = difference_dataframe[matching.SPATIAL_LIST].sum(axis=1)
    difference_dataframe["income"] = difference_dataframe[matching.INCOME_LIST].sum(axis=1)
    difference_dataframe["gender"] = difference_dataframe[matching.GENDER_LIST].sum(axis=1)
    difference_dataframe["race"] = difference_dataframe[matching.RACE_LIST].sum(axis=1)
    difference_dataframe["age"] = difference_dataframe[matching.AGE_LIST].sum(axis=1)
    difference_dataframe["education"] = difference_dataframe[matching.EDUCATION_LIST].sum(axis=1)
    difference_dataframe["travel_time"] = difference_dataframe[matching.TRAVEL_TIME_LIST].sum(axis=1)
    difference_dataframe["transport"] = difference_dataframe[matching.TRANSPORT_LIST].sum(axis=1)
    difference_dataframe["psycho3"] = difference_dataframe[matching.SPATIAL_LIST_3MILE].sum(axis=1)
    difference_dataframe["income3"] = difference_dataframe[matching.INCOME_LIST_3MILE].sum(axis=1)
    difference_dataframe["gender3"] = difference_dataframe[matching.GENDER_LIST_3MILE].sum(axis=1)
    difference_dataframe["race3"] = difference_dataframe[matching.RACE_LIST_3MILE].sum(axis=1)
    difference_dataframe["age3"] = difference_dataframe[matching.AGE_LIST_3MILE].sum(axis=1)
    difference_dataframe["education3"] = difference_dataframe[matching.EDUCATION_LIST_3MILE].sum(axis=1)
    difference_dataframe["travel_time3"] = difference_dataframe[matching.TRAVEL_TIME_LIST_3MILE].sum(axis=1)
    difference_dataframe["transport3"] = difference_dataframe[matching.TRANSPORT_LIST_3MILE].sum(axis=1)
    # difference_dataframe["nearby_categories"] = difference_dataframe[matching.FOURSQUARE_CATEGORIES].sum(axis=1)

    return difference_dataframe


def standardize(processed_difference_df):
    # NOTE - this implementation assumes that details dataframe and the match_df are aligned.
    # Pandas auto aligns items, but note that there is a risk if they ever change that feature
    min_index = 3
    max_index = 7

    # return (processed_difference_df - COLUMN_MIN_MAX_DF.iloc[min_index]) / \
    #     (COLUMN_MIN_MAX_DF.iloc[max_index] - COLUMN_MIN_MAX_DF.iloc[max_index])

    for column in processed_difference_df.columns:
        processed_difference_df[column] = (processed_difference_df[column] - COLUMN_MIN_MAX_DF.iloc[min_index][column]) / \
            (COLUMN_MIN_MAX_DF.iloc[max_index][column] - COLUMN_MIN_MAX_DF.iloc[min_index][column])

    return processed_difference_df


def weight_and_evaluate(standardized_df):

    # weight and sum the differences
    weight = {
        # 1 mile weights
        'MedHouseholdIncome1': 5,
        'income': 4.8,
        'race': 4.6,
        'DaytimePop1': 4.4,
        'TotalHouseholds1': 4.2,
        # 'nearby_categories': 4,
        'DaytimeResidentPop1': 4,
        'psycho': 4,
        'age': 3.8,
        'transport': 3.6,
        'travel_time': 3.6,
        'education': 3.6,
        'gender': 3.6,
        # 3 mile weights
        'MedHouseholdIncome13': 3.5,
        'income3': 3.3,
        'race3': 3.1,
        'DaytimePop13': 3,
        'TotalHouseholds13': 3,
        'DaytimeResidentPop13': 3,
        'psycho3': 3,
        'age3': 2.9,
        'transport3': 2.7,
        'travel_time3': 2.7,
        'education3': 2.6,
        'gender3': 2.6,
    }

    weight_df = pd.DataFrame([weight])
    standardized_df["error_sum"] = standardized_df[list(weight.keys())].copy().dot(weight_df.transpose()) / \
        sum(weight.values())

    return standardized_df
