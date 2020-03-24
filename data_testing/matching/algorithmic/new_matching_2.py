import sys
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)  # include data_testing

from decouple import config
from s3fs import S3FileSystem
import api.environics as environics
import api.arcgis as arcgis
import api.spatial as spatial
import api.google as google
import utils
import time


'''
Test file for matching algorithms.
'''

AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY")

S3_FILESYSTEM = S3FileSystem(
    key=AWS_ACCESS_KEY_ID, secret=AWS_SECRET_ACCESS_KEY)

BLOCK_DF = utils.read_dataframe_csv(
    'insemble-dataframes/block_df.csv.gz', file_system=S3_FILESYSTEM)
SPATIAL_DF = utils.read_dataframe_csv(
    'insemble-dataframes/spatial_df.csv.gz', file_system=S3_FILESYSTEM)
DEMO_DF = utils.read_dataframe_csv(
    'insemble-dataframes/demo_df.csv.gz', file_system=S3_FILESYSTEM)
# MATCHING_DF = utils.read_dataframe_csv(
#     'insemble-dataframes/full_df_csv.csv.gz', file_system=S3_FILESYSTEM)
MATCHING_DETAILS_DF = utils.read_dataframe_csv(
    'insemble-dataframes/match_details.csv.gz', file_system=S3_FILESYSTEM)
print(MATCHING_DETAILS_DF)
SPATIAL_CATEGORIES = utils.DB_SPATIAL_CATS.find_one(
    {'name': 'spatial_categories'})['spatial_categories']
DEMO_CATEGORIES = utils.DB_DEMOGRAPHIC_CATS.find_one(
    {'name': 'demo_categories'})['demo_categories']


# DEFINE LIST OF MATCH CRITERIA
# TODO: implement logic leveraging growth statistics

# persona keys for 1 and 3 miles
SPATIAL_LIST = ['Bookish', 'Engine Enthusiasts', 'Green Thumb', 'Natural Beauty',
                'Wanderlust', 'Handcrafted', 'Animal Advocates', 'Dog Lovers', 'Smoke Culture',
                'Daily Grind', 'Nerd Culture', 'LGBTQ Culture', 'Wealth Signaling', 'Hipster',
                'Student Life', 'Farm Culture', 'Love & Romance', 'Happily Ever After',
                'Dating Life', 'Connected Motherhood', 'Family Time', 'My Crew', 'Girl Squad',
                'Networking', 'Sweet Treats', 'Coffee Connoisseur', 'Trendy Eats',
                'Whiskey Business', 'Asian Food & Culture', 'Ingredient Attentive',
                'Fueling for Fitness', 'Wine Lovers', 'Hops & Brews', 'Film Lovers',
                'Competitive Nature', 'Live Experiences', 'Late-Night Leisure', 'Party Life',
                'Live & Local Music', 'Lighthearted Fun', 'Deep Emotions', 'Heartfelt Sharing',
                'Awestruck', 'Happy Place', 'Gratitude', 'Memory Lane', 'Dance Devotion',
                'Artistic Appreciation', 'Pieces of History', 'Sites to See', 'Hip Hop Culture',
                'Mindfulness & Spirituality', 'Activism', 'Politically Engaged', 'Praise & Worship',
                'Conservation', 'Civic Attentiveness', 'Trend Trackers', 'All About Hair',
                "Men's Style", 'Fitness Fashion', 'Body Art', 'Smart Chic', 'Home & Leisure',
                'Past Reflections', 'Humanitarian', 'Deal Seekers', 'Organized Sports',
                'Fitness Obsession', 'Outdoor Adventures', 'Yoga Advocates', 'Functional Fitness']
SPATIAL_LIST_3MILE = [persona + "3" for persona in SPATIAL_LIST]

# gender keys for 1 and 3 miles
GENDER_LIST = ["Current Year Population, Female",
               "Current Year Population, Male"]
GENDER_LIST_3MILE = [gender + "3" for gender in GENDER_LIST]

# income list for 1 and 3 miles
INCOME_LIST = ["Current Year Households, Household Income < $15,000",
               "Current Year Households, Household Income $15,000 - $24,999",
               "Current Year Households, Household Income $25,000 - $34,999",
               "Current Year Households, Household Income $35,000 - $49,999",
               "Current Year Households, Household Income $50,000 - $74,999",
               "Current Year Households, Household Income $75,000 - $99,999",
               "Current Year Households, Household Income $100,000 - $124,999",
               "Current Year Households, Household Income $125,000 - $149,999",
               "Current Year Households, Household Income $150,000 - $199,999",
               "Current Year Households, Household Income $200,000 - $249,999",
               "Current Year Households, Household Income $250,000 - $499,999",
               "Current Year Households, Household Income $500,000+"]
INCOME_LIST_3MILE = [income + "3" for income in INCOME_LIST]

# age keys for 1 and 3 miles
AGE_LIST = ["Current Year Population, Age 0 - 4", "Current Year Population, Age 5 - 9",
            "Current Year Population, Age 10 - 14", "Current Year Population, Age 15 - 17",
            "Current Year Population, Age 18 - 20", "Current Year Population, Age 21 - 24",
            "Current Year Population, Age 25 - 34", "Current Year Population, Age 35 - 44",
            "Current Year Population, Age 45 - 54", "Current Year Population, Age 55 - 64",
            "Current Year Population, Age 65+"]
AGE_LIST_3MILE = [age + "3" for age in AGE_LIST]

# race keys for 1 and 3 miles
RACE_LIST = ["Current Year Population, American Indian/Alaskan Native Alone",
             "Current Year Population, American Indian/Alaskan Native Alone Or In Combination",
             "Current Year Population, American Indian/Alaskan Native Alone, Female",
             "Current Year Population, American Indian/Alaskan Native Alone, Male",
             "Current Year Population, Asian Alone", "Current Year Population, Asian Alone Or In Combination",
             "Current Year Population, Asian Alone, Female", "Current Year Population, Asian Alone, Male",
             "Current Year Population, Black/African American Alone",
             "Current Year Population, Black/African American Alone Or In Combination",
             "Current Year Population, Black/African American Alone, Female",
             "Current Year Population, Black/African American Alone, Male",
             "Current Year Population, Native Hawaiian/Pacific Islander Alone",
             "Current Year Population, Native Hawaiian/Pacific Islander Alone Or In Combination",
             "Current Year Population, Native Hawaiian/Pacific Islander Alone, Female",
             "Current Year Population, Native Hawaiian/Pacific Islander Alone, Male",
             "Current Year Population, Some Other Race Alone",
             "Current Year Population, Some Other Race Alone Or In Combination",
             "Current Year Population, Some Other Race Alone, Female",
             "Current Year Population, Some Other Race Alone, Male",
             "Current Year Population, White Alone", "Current Year Population, White Alone Or In Combination",
             "Current Year Population, White Alone, Female", "Current Year Population, White Alone, Male"]
RACE_LIST_3MILE = [race + "3" for race in RACE_LIST]

# education for 1 and 3 miles
EDUCATION_LIST = ["Current Year Population 25+, Some High School, No Diploma",
                  "Current Year Population 25+, High School Graduate (Including Equivalent)",
                  "Current Year Population 25+, Some College, No Degree",
                  "Current Year Population 25+, Associate's Degree",
                  "Current Year Population 25+, Bachelor's Degree",
                  "Current Year Population 25+, Master's Degree",
                  "Current Year Population 25+, Professional Degree",
                  "Current Year Population 25+, Doctorate Degree"]
EDUCATION_LIST_3MILE = [education + "3" for education in EDUCATION_LIST]

# travel time keys for 1 and 3 miles
TRAVEL_TIME_LIST = ["Current Year Workers, Travel Time To Work: < 15 Minutes",
                    "Current Year Workers, Travel Time To Work: 15 - 29 Minutes",
                    "Current Year Workers, Travel Time To Work: 30 - 44 Minutes"]
TRAVEL_TIME_LIST_3MILE = [travel_time +
                          "3" for travel_time in TRAVEL_TIME_LIST]

# transport list keys for 1 and 3 miles
TRANSPORT_LIST = ["Current Year Workers, Transportation To Work: Public Transport",
                  "Current Year Workers, Transportation to Work: Bicycle",
                  "Current Year Workers, Transportation to Work: Carpooled",
                  "Current Year Workers, Transportation to Work: Drove Alone",
                  "Current Year Workers, Transportation to Work: Walked",
                  "Current Year Workers, Transportation to Work: Worked at Home"]
TRANSPORT_LIST_3MILE = [transport + "3" for transport in TRANSPORT_LIST]

FOURSQUARE_CATEGORIES = utils.DB_FOURSQUARE.find_one(
    {'name': 'foursquare_categories'})['foursquare_categories']

ARCGIS_IGNORE_LIST = ["DaytimePop1", "DaytimePop13", "DaytimeWorkingPop1", "DaytimeWorkingPop13", "DaytimeResidentPop1", "DaytimeResidentPop13",
                      "TotalHouseholds1", "TotalHouseholds13", "HouseholdGrowth2017-2022-1", "HouseholdGrowth2017-2022-13"]
ARCGIS_LIST = ARCGIS_IGNORE_LIST + ["MedHouseholdIncome1", "MedHouseholdIncome13"]


TOTAL_LIST = ARCGIS_LIST + INCOME_LIST + INCOME_LIST_3MILE + AGE_LIST + AGE_LIST_3MILE + RACE_LIST + RACE_LIST_3MILE + \
    EDUCATION_LIST + EDUCATION_LIST_3MILE + TRANSPORT_LIST + TRANSPORT_LIST_3MILE + TRANSPORT_LIST + TRAVEL_TIME_LIST_3MILE + \
    GENDER_LIST + GENDER_LIST_3MILE + SPATIAL_LIST + TRAVEL_TIME_LIST + SPATIAL_LIST_3MILE


def generate_matches(location_address, name=None, my_place_type={}):
    """
    Given an address, will generate a ranking of addresses that are the most similar
    accross all aspects to this location.
    """

    start = time.time()

    num_documents = 32000

    # Get the mathmatical vector - DONE: MATCHING_DETAILS_DF
    matching_vectors = utils.DB_VECTORS_LA.find({}).limit(num_documents)
    prospect = get_location_dict(location_address, name=name)

    vector_received = time.time()

    pre_processed_dict = preprocess_dict(prospect)
    normalized_dict = normalize(pre_processed_dict)

    all_values = {}
    matches = []

    for vector in matching_vectors:
        # save important contextual information

        lat = vector.pop('lat')
        lng = vector.pop('lng')
        _id = vector.pop('_id')

        # remove other items that will get in the way of matching
        _, _, _, _ = vector.pop('block'), vector.pop('blockgroup'), vector.pop('tract'), vector.pop('loc_id')

        pre_processed_comp = preprocess_dict(vector)
        normalized_comp = normalize(pre_processed_comp)
        diff = subtract_and_abs(normalized_dict, normalized_comp)
        post_processed_dict = postprocess_dict(diff)
        match_value, heatmap_value = evaluate_match(post_processed_dict)

        # if good enough, send to the front end to be rendered
        if match_value > 70:
            matches.append({
                'lat': lat,
                'lng': lng,
                'match': heatmap_value
            })

        # regardless, save in tenant database so that it can be access later.
        all_values[str(_id)] = match_value

    # tenant_id = utils.DB_TENANT.insert({'match_values': all_values})

    end = time.time()
    vector_time = vector_received - start
    total_time = end - start
    print("Total time for {}  items is {}. {} of this time spent on vectorization".format(num_documents, total_time, vector_time))

    return matches  # , _id


def get_location_dict(address, name, lat=None, lng=None):

    if not (lat and lng):
        if name:
            location = google.find(address, name=name, allow_non_establishments=True)
            if not location:
                location = google.find(address, allow_non_establishments=True)
        else:
            location = google.find(address, allow_non_establishments=True)
        lat = location["geometry"]["location"]["lat"]
        lng = location["geometry"]["location"]["lng"]

    # get data (1 mile)
    psycho_dict = spatial.get_psychographics(lat, lng, 1)
    arcgis_dict = arcgis.details(lat, lng, 1)
    demo_dict = environics.get_demographics(lat, lng, 1)

    # get data (3 mile)
    psycho_dict3 = spatial.get_psychographics(lat, lng, 3)
    arcgis_dict3 = arcgis.details(lat, lng, 3)
    demo_dict3 = environics.get_demographics(lat, lng, 3)

    arcgis_dict = {key + "1": value for key, value in arcgis_dict.items()}
    arcgis_dict["HouseholdGrowth2017-2022-1"] = arcgis_dict.pop(
        "HouseholdGrowth2017-20221")

    # demo - gender, race, age, travel time, transport methods
    gender_dict = demo_dict["Current Year Population, Gender"]
    race_dict = demo_dict["Current Year Population, Race"]
    age_dict = demo_dict["Current Year Population, Age"]
    education_dict = demo_dict["Current Year Population 25+, Education"]
    transport_dict = demo_dict["Current Year Workers, Transportation to Work"]
    travel_time_dict = demo_dict["Current Year Workers, Travel Time To Work"]
    income_dict = demo_dict["Current Year Households, Household Income"]

    # CREATE ARRAY AS DATAFRAME (for 3 MILE)
    psycho_dict3 = {key + "3": value for key, value in psycho_dict3.items()}
    arcgis_dict3 = {key + "13": value for key, value in arcgis_dict3.items()}
    arcgis_dict3["HouseholdGrowth2017-2022-13"] = arcgis_dict3.pop(
        "HouseholdGrowth2017-202213")
    # demo - gender, race, age, travel time, transport methods
    gender_dict3 = {key + "3": value for key,
                    value in demo_dict3["Current Year Population, Gender"].items()}
    race_dict3 = {key + "3": value for key,
                  value in demo_dict3["Current Year Population, Race"].items()}
    age_dict3 = {key + "3": value for key,
                 value in demo_dict3["Current Year Population, Age"].items()}
    education_dict3 = {key + "3": value for key,
                       value in demo_dict3["Current Year Population 25+, Education"].items()}
    transport_dict3 = {key + "3": value for key,
                       value in demo_dict3["Current Year Workers, Transportation to Work"].items()}
    travel_time_dict3 = {key + "3": value for key,
                         value in demo_dict3["Current Year Workers, Travel Time To Work"].items()}
    income_dict3 = {key + "3": value for key,
                    value in demo_dict3["Current Year Households, Household Income"].items()}

    # ADD and evaluate all the nearby stores and restaurants to the array.
    # TODO: make less redundant (same method for restaurant and store)
    nearby_stores = google.nearby(lat, lng, 'store', 1)

    categories = {}
    if nearby_stores:
        id_list = [place['place_id'] for place in nearby_stores]
        spaces = utils.DB_PROCESSED_SPACE.find({"place_id": {"$in": id_list}})

        for place_details in spaces:
            if not place_details:
                continue

            category_list = place_details.get(
                "foursquare_categories", [{"category_name": None}])
            if len(category_list) == 0:
                continue

            category = category_list[0]["category_name"]
            if category:
                categories[category] = categories.get(
                    category, 0) + 1

    nearby_restaurant = google.nearby(lat, lng, 'restaurant', 1)
    if nearby_restaurant:

        id_list = [place['place_id'] for place in nearby_restaurant]
        spaces = utils.DB_PROCESSED_SPACE.find({"place_id": {"$in": id_list}})

        for place_details in spaces:
            if not place_details:
                continue

            category_list = place_details.get(
                "foursquare_categories", [{"category_name": None}])
            if len(category_list) == 0:
                continue

            category = category_list[0]["category_name"]
            if category:
                categories[category] = categories.get(
                    category, 0) + 1

    vector_dict = dict(psycho_dict, **psycho_dict3, **arcgis_dict, **arcgis_dict3, **gender_dict, **gender_dict3,
                       **race_dict, **race_dict3, **age_dict, **age_dict3, **education_dict, **education_dict3,
                       **transport_dict, **transport_dict3, **income_dict, **income_dict3, **travel_time_dict,
                       **travel_time_dict3, **categories)

    return vector_dict


def preprocess_dict(match_dict):
    income_sum = sum(match_dict[item] for item in INCOME_LIST)
    income_sum3 = sum(match_dict[item] for item in INCOME_LIST_3MILE)
    age_sum = sum(match_dict[item] for item in AGE_LIST)
    age_sum3 = sum(match_dict[item] for item in AGE_LIST_3MILE)
    transport_sum = sum(match_dict[item] for item in TRANSPORT_LIST)
    transport_sum3 = sum(match_dict[item] for item in TRANSPORT_LIST_3MILE)
    travel_time_sum = sum(match_dict[item] for item in TRAVEL_TIME_LIST)
    travel_time_sum3 = sum(match_dict[item] for item in TRAVEL_TIME_LIST_3MILE)
    education_sum = sum(match_dict[item] for item in EDUCATION_LIST)
    education_sum3 = sum(match_dict[item] for item in EDUCATION_LIST_3MILE)
    race_sum = sum(match_dict[item] for item in RACE_LIST)
    race_sum3 = sum(match_dict[item] for item in RACE_LIST_3MILE)
    gender_sum = sum(match_dict[item] for item in GENDER_LIST)
    gender_sum3 = sum(match_dict[item] for item in GENDER_LIST_3MILE)
    for income in INCOME_LIST:
        match_dict[income] = match_dict[income] / income_sum
    for income_3mile in INCOME_LIST_3MILE:
        match_dict[income_3mile] = match_dict[income_3mile] / income_sum3
    for age in AGE_LIST:
        match_dict[age] = match_dict[age] / age_sum
    for age_3mile in AGE_LIST_3MILE:
        match_dict[age_3mile] = match_dict[age_3mile] / age_sum3
    for transport_method in TRANSPORT_LIST:
        match_dict[transport_method] = match_dict[transport_method] / transport_sum
    for transport_method_3mile in TRANSPORT_LIST_3MILE:
        match_dict[transport_method_3mile] = match_dict[transport_method_3mile] / transport_sum3
    for travel_time in TRAVEL_TIME_LIST:
        match_dict[travel_time] = match_dict[travel_time] / travel_time_sum
    for travel_time_3mile in TRAVEL_TIME_LIST_3MILE:
        match_dict[travel_time_3mile] = match_dict[travel_time_3mile] / travel_time_sum3
    for eductation_level in EDUCATION_LIST:
        match_dict[eductation_level] = match_dict[eductation_level] / education_sum
    for eductation_level_3mile in EDUCATION_LIST_3MILE:
        match_dict[eductation_level_3mile] = match_dict[eductation_level_3mile] / education_sum3
    for ethnicity in RACE_LIST:
        match_dict[ethnicity] = match_dict[ethnicity] / race_sum
    for ethnicity_3mile in RACE_LIST_3MILE:
        match_dict[ethnicity_3mile] = match_dict[ethnicity_3mile] / race_sum3
    for gender in GENDER_LIST:
        match_dict[gender] = match_dict[gender] / gender_sum
    for gender_3mile in GENDER_LIST_3MILE:
        match_dict[gender_3mile] = match_dict[gender_3mile] / gender_sum3

    return match_dict


# given a match dataframe, will preprocess into the correct format
def preprocess_match_df(dataframe):

    for item in ARCGIS_LIST:
        dataframe.loc[dataframe[item] > dataframe.iloc[-1].loc[item],
                      item] = dataframe.iloc[-1].loc[item]

    return dataframe


def normalize(processed_dict):
    min_index = 3
    max_index = 7
    normalize_df = MATCHING_DETAILS_DF
    processed_dict = {
        key: (processed_dict[key] - normalize_df.loc[min_index, key]) / (normalize_df.loc[max_index, key] - normalize_df.loc[min_index, key]) for key in TOTAL_LIST
    }
    return processed_dict


def subtract_and_abs(subtractor, subtractee):
    # do not penalize for having larger items in ARCGIS list
    for item in ARCGIS_IGNORE_LIST:
        if subtractee[item] > subtractor[item]:
            subtractee[item] = subtractor[item]

    return {
        key: abs(subtractor.get(key, 0) - subtractee.get(key, 0)) for key in TOTAL_LIST + FOURSQUARE_CATEGORIES
    }

# given difference matrix, post proesses items into groups that work together


def postprocess_dict(diff_dict):

    # group features that are evaluated & normalized together
    diff_dict["psycho"] = sum(diff_dict[item] for item in SPATIAL_LIST) / len(SPATIAL_LIST)
    diff_dict["income"] = sum(diff_dict[item] for item in INCOME_LIST) / len(INCOME_LIST)
    diff_dict["gender"] = sum(diff_dict[item] for item in GENDER_LIST) / len(GENDER_LIST)
    diff_dict["race"] = sum(diff_dict[item] for item in RACE_LIST) / len(RACE_LIST)
    diff_dict["age"] = sum(diff_dict[item] for item in AGE_LIST) / len(AGE_LIST)
    diff_dict["education"] = sum(diff_dict[item] for item in EDUCATION_LIST) / len(EDUCATION_LIST)
    diff_dict["travel_time"] = sum(diff_dict[item] for item in TRAVEL_TIME_LIST) / len(TRAVEL_TIME_LIST)
    diff_dict["transport"] = sum(diff_dict[item] for item in TRANSPORT_LIST) / len(TRANSPORT_LIST)
    diff_dict["psycho3"] = sum(diff_dict[item] for item in SPATIAL_LIST_3MILE) / len(SPATIAL_LIST_3MILE)
    diff_dict["income3"] = sum(diff_dict[item] for item in INCOME_LIST_3MILE) / len(INCOME_LIST_3MILE)
    diff_dict["gender3"] = sum(diff_dict[item] for item in GENDER_LIST_3MILE) / len(GENDER_LIST_3MILE)
    diff_dict["race3"] = sum(diff_dict[item] for item in RACE_LIST_3MILE) / len(RACE_LIST_3MILE)
    diff_dict["age3"] = sum(diff_dict[item] for item in AGE_LIST_3MILE) / len(AGE_LIST_3MILE)
    diff_dict["education3"] = sum(diff_dict[item] for item in EDUCATION_LIST_3MILE) / len(EDUCATION_LIST_3MILE)
    diff_dict["travel_time3"] = sum(diff_dict[item] for item in TRAVEL_TIME_LIST_3MILE) / len(TRAVEL_TIME_LIST_3MILE)
    diff_dict["transport3"] = sum(diff_dict[item] for item in TRANSPORT_LIST_3MILE) / len(TRANSPORT_LIST_3MILE)
    # following calculation is too slow, needs to be sped up
    diff_dict["nearby_categories"] = sum(diff_dict[item] for item in FOURSQUARE_CATEGORIES if item in diff_dict)

    return diff_dict

# given difference matrix, post proesses items into groups that work together


# will normalize, weight, and evaluate the vectors
def evaluate_match(processed_diff):

    # weight and sum the differences
    weight = {
        # 1 mile weights
        'DaytimePop1': 5,
        'MedHouseholdIncome1': 4.8,
        'income': 4.6,
        'TotalHouseholds1': 4.4,
        'nearby_categories': 4.2,
        'DaytimeResidentPop1': 4,
        'psycho': 4,
        'age': 4,
        'transport': 3.8,
        'travel_time': 3.6,
        'education': 3.6,
        'race': 3.6,
        'gender': 3.6,
        # 3 mile weights
        'DaytimePop13': 3.5,
        'MedHouseholdIncome13': 3.3,
        'income3': 3.1,
        'TotalHouseholds13': 3,
        'DaytimeResidentPop13': 3,
        'psycho3': 3,
        'age3': 3,
        'transport3': 2.9,
        'travel_time3': 2.7,
        'education3': 2.7,
        'race3': 2.6,
        'gender3': 2.6,
    }

    error = sum(weight[key] * processed_diff[key] for key in weight.keys()) / sum(weight.values())
    return _map_difference_to_match(error), _map_difference_to_heatmap(error)


def _map_difference_to_match(difference):
    # map difference to a match rating between 0 and 100
    difference_max = 1
    difference_min_est = 0

    return utils.translate(difference, difference_max, difference_min_est, 0, 100)


def _map_difference_to_heatmap(difference):

    # difference expected to be between 0 and 1

    value = 1 - difference

    if value < .7:
        return 0.1
    if value < .75:
        return 0.3
    if value < 0.8:
        return 0.6
    return 4


if __name__ == "__main__":
    # print(_generate_location_vector("371 E 2nd Street, LA", name="Spitz"))
    generate_matches("371 E 2nd Street", name="Spitz")

    # print(generate_matches_v1("371 E 2nd Street, LA"))
