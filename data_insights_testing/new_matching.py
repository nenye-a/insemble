import sys
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, 'data_aggregator'))
from decouple import config
import time
import pandas as pd
from s3fs import S3FileSystem
import environics
import arcgis
import spatial
import goog as google
import utils


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
MATCHING_DF = utils.read_dataframe_csv(
    'insemble-dataframes/full_df_csv.csv.gz', file_system=S3_FILESYSTEM)
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
AGE_LIST = ["Current Year Population, Age 0 - 4", "Current Year Population, Age 10 - 14",
            "Current Year Population, Age 15 - 17", "Current Year Population, Age 18 - 20",
            "Current Year Population, Age 21 - 24", "Current Year Population, Age 25 - 34",
            "Current Year Population, Age 35 - 44", "Current Year Population, Age 45 - 54",
            "Current Year Population, Age 5 - 9", "Current Year Population, Age 55 - 64",
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
TRAVEL_TIME_LIST = ["Current Year Workers, Travel Time To Work: 15 - 29 Minutes",
                    "Current Year Workers, Travel Time To Work: 30 - 44 Minutes",
                    "Current Year Workers, Travel Time To Work: < 15 Minutes"]
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


def generate_matches_v1(location_address, my_place_type={}):
    """
    Given an address, will generate a ranking of addresses that are the most similar
    accross all aspects to this location.
    """

    my_location_df = _generate_location_vector(location_address)

    # get preprocessed vectors
    df = MATCHING_DF.copy()

    df2 = df.drop(columns=["_id", "lat", "lng", "loc_id"])
    # ADDITIONAL - PREPROCESS FIELDS
    print(my_location_df)
    print("Preprocess start")

    # add my vector to the list
    df2 = df2.append(my_location_df)
    df2 = df2.fillna(0)

    # convert all tier break downs to percentage
    # TODO: Clean up pre processing code below
    income_sum = df2[INCOME_LIST].sum(axis=1)
    income_sum3 = df2[INCOME_LIST_3MILE].sum(axis=1)
    age_sum = df2[AGE_LIST].sum(axis=1)
    age_sum3 = df2[AGE_LIST_3MILE].sum(axis=1)
    transport_sum = df2[TRANSPORT_LIST].sum(axis=1)
    transport_sum3 = df2[TRANSPORT_LIST_3MILE].sum(axis=1)
    travel_time_sum = df2[TRAVEL_TIME_LIST].sum(axis=1)
    travel_time_sum3 = df2[TRAVEL_TIME_LIST_3MILE].sum(axis=1)
    education_sum = df2[EDUCATION_LIST].sum(axis=1)
    education_sum3 = df2[EDUCATION_LIST_3MILE].sum(axis=1)
    race_sum = df2[RACE_LIST].sum(axis=1)
    race_sum3 = df2[RACE_LIST_3MILE].sum(axis=1)
    gender_sum = df2[GENDER_LIST].sum(axis=1)
    gender_sum3 = df2[GENDER_LIST_3MILE].sum(axis=1)
    for income in INCOME_LIST:
        df2[income] = df2[income] / income_sum
    for income_3mile in INCOME_LIST_3MILE:
        df2[income_3mile] = df2[income_3mile] / income_sum3
    for age in AGE_LIST:
        df2[age] = df2[age] / age_sum
    for age_3mile in AGE_LIST_3MILE:
        df2[age_3mile] = df2[age_3mile] / age_sum3
    for transport_method in TRANSPORT_LIST:
        df2[transport_method] = df2[transport_method] / transport_sum
    for transport_method_3mile in TRANSPORT_LIST_3MILE:
        df2[transport_method_3mile] = df2[transport_method_3mile] / transport_sum3
    for travel_time in TRAVEL_TIME_LIST:
        df2[travel_time] = df2[travel_time] / travel_time_sum
    for travel_time_3mile in TRAVEL_TIME_LIST_3MILE:
        df2[travel_time_3mile] = df2[travel_time_3mile] / travel_time_sum3
    for eductation_level in EDUCATION_LIST:
        df2[eductation_level] = df2[eductation_level] / education_sum
    for eductation_level_3mile in EDUCATION_LIST_3MILE:
        df2[eductation_level_3mile] = df2[eductation_level_3mile] / education_sum3
    for ethnicity in RACE_LIST:
        df2[ethnicity] = df2[ethnicity] / race_sum
    for ethnicity_3mile in RACE_LIST_3MILE:
        df2[ethnicity_3mile] = df2[ethnicity_3mile] / race_sum3
    for gender in GENDER_LIST:
        df2[gender] = df2[gender] / gender_sum
    for gender_3mile in GENDER_LIST_3MILE:
        df2[gender_3mile] = df2[gender_3mile] / gender_sum3
    print("% pre-processing-complete")

    # No penalty for having higher daytime population than the existing location.
    arcgis_items = ["DaytimePop1", "DaytimePop13", "DaytimeWorkingPop1", "DaytimeWorkingPop13", "DaytimeResidentPop1", "DaytimeResidentPop13",
                    "TotalHouseholds1", "TotalHouseholds13", "HouseholdGrowth2017-2022-1", "HouseholdGrowth2017-2022-13"]
    for item in arcgis_items:
        df2.loc[df2[item] > df2.iloc[-1].loc[item],
                item] = df2.iloc[-1].loc[item]

    print("day time pre-processing complete")

    # SUBTRACT VECTOR
    diff = df2.subtract(df2.iloc[-1])
    diff = diff.iloc[:-1]

    # POST PROCESS
    # group features that are evaluated & normalized together
    diff["psycho"] = diff[SPATIAL_LIST].sum(axis=1)
    diff["income"] = diff[INCOME_LIST].sum(axis=1)
    diff["gender"] = diff[GENDER_LIST].sum(axis=1)
    diff["race"] = diff[RACE_LIST].sum(axis=1)
    diff["age"] = diff[AGE_LIST].sum(axis=1)
    diff["education"] = diff[EDUCATION_LIST].sum(axis=1)
    diff["travel_time"] = diff[TRAVEL_TIME_LIST].sum(axis=1)
    diff["transport"] = diff[TRANSPORT_LIST].sum(axis=1)
    diff["psycho3"] = diff[SPATIAL_LIST_3MILE].sum(axis=1)
    diff["income3"] = diff[INCOME_LIST_3MILE].sum(axis=1)
    diff["gender3"] = diff[GENDER_LIST_3MILE].sum(axis=1)
    diff["race3"] = diff[RACE_LIST_3MILE].sum(axis=1)
    diff["age3"] = diff[AGE_LIST_3MILE].sum(axis=1)
    diff["education3"] = diff[EDUCATION_LIST_3MILE].sum(axis=1)
    diff["travel_time3"] = diff[TRAVEL_TIME_LIST_3MILE].sum(axis=1)
    diff["transport3"] = diff[TRANSPORT_LIST_3MILE].sum(axis=1)
    diff["nearby_categories"] = diff[FOURSQUARE_CATEGORIES].sum(axis=1)

    # normalize between 0 and 1
    norm_df = (diff - diff.min()) / (diff.max() - diff.min())
    norm_df['lat'], norm_df['lng'], norm_df['loc_id'] = df['lat'], df['lng'], df['loc_id']

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
    weight_df = pd.DataFrame([weight])

    # CALCULATE DISTANCE & MATCH
    # Investigation into using euclidean distance ongoing.
    norm_df["error_sum"] = norm_df[weight.keys()].dot(weight_df.transpose())

    # Return only the top 1% of locations.
    norm_df = norm_df[:-1]
    best = norm_df.nsmallest(int(norm_df.shape[0] * 0.01), 'error_sum')

    # Convert distance to match value, and convert any object ids to strings to allow JSON serialization
    best["match"] = best["error_sum"].apply(_map_difference_to_match)
    best["loc_id"] = best["loc_id"].apply(str)

    return best[['lat', 'lng', 'match', 'loc_id']].to_json(orient='records')


# Given an address, generates a vector of a location that can be used
# to compare against vectors stored in mongodb.
def _generate_location_vector(address):

    # get latitude and longitude from the address.
    location = google.find(address, allow_non_establishments=True)

    lat = location["geometry"]["location"]["lat"]
    lng = location["geometry"]["location"]["lng"]

    # get data (1 mile)
    psycho_dict = spatial.get_psychographics(
        lat, lng, 1, SPATIAL_DF, BLOCK_DF, SPATIAL_CATEGORIES)
    arcgis_dict = arcgis.details(lat, lng, 1)
    demo_dict = environics.get_demographics(
        lat, lng, 1, DEMO_DF, BLOCK_DF, DEMO_CATEGORIES)

    # get data (3 mile)
    psycho_dict3 = spatial.get_psychographics(
        lat, lng, 3, SPATIAL_DF, BLOCK_DF, SPATIAL_CATEGORIES)
    arcgis_dict3 = arcgis.details(lat, lng, 3)
    demo_dict3 = environics.get_demographics(
        lat, lng, 3, DEMO_DF, BLOCK_DF, DEMO_CATEGORIES)

    # CREATE ARRAY AS DATAFRAME (for 1 MILE)
    # create psychographic dataframe
    psycho_df = pd.DataFrame([psycho_dict], columns=psycho_dict.keys())

    # arcgis - num households, daytime pop, daytime working pop, income, etc.
    arcgis_dict = {key + "1": value for key, value in arcgis_dict.items()}
    arcgis_dict["HouseholdGrowth2017-2022-1"] = arcgis_dict.pop(
        "HouseholdGrowth2017-20221")
    arcgis_df = pd.DataFrame([arcgis_dict], columns=arcgis_dict.keys())

    # demo - gender, race, age, travel time, transport methods
    gender_dict = demo_dict["Current Year Population, Gender"]
    gender_df = pd.DataFrame([gender_dict], columns=gender_dict.keys())
    race_dict = demo_dict["Current Year Population, Race"]
    race_df = pd.DataFrame([race_dict], columns=race_dict.keys())
    age_dict = demo_dict["Current Year Population, Age"]
    age_df = pd.DataFrame([age_dict], columns=age_dict.keys())
    education_dict = demo_dict["Current Year Population 25+, Education"]
    education_df = pd.DataFrame(
        [education_dict], columns=education_dict.keys())
    transport_dict = demo_dict["Current Year Workers, Transportation to Work"]
    transport_df = pd.DataFrame(
        [transport_dict], columns=transport_dict.keys())
    travel_time_dict = demo_dict["Current Year Workers, Travel Time To Work"]
    travel_time_df = pd.DataFrame(
        [travel_time_dict], columns=travel_time_dict.keys())
    income_dict = demo_dict["Current Year Households, Household Income"]
    income_df = pd.DataFrame([income_dict], columns=income_dict.keys())

    array_1mile_dataframes = [
        psycho_df, arcgis_df, gender_df, race_df, age_df, education_df, transport_df, travel_time_df, income_df]

    # CREATE ARRAY AS DATAFRAME (for 3 MILE)
    # create psychographic dataframe
    psycho_dict3 = {key + "3": value for key, value in psycho_dict3.items()}
    psycho_df3 = pd.DataFrame([psycho_dict3], columns=psycho_dict3.keys())

    # arcgis - num households, daytime pop, daytime working pop, income
    arcgis_dict3 = {key + "13": value for key, value in arcgis_dict3.items()}
    arcgis_dict3["HouseholdGrowth2017-2022-13"] = arcgis_dict3.pop(
        "HouseholdGrowth2017-202213")
    arcgis_df3 = pd.DataFrame([arcgis_dict3], columns=arcgis_dict3.keys())
    # demo - gender, race, age, travel time, transport methods
    gender_dict = {key + "3": value for key,
                   value in demo_dict3["Current Year Population, Gender"].items()}
    gender_df3 = pd.DataFrame([gender_dict], columns=gender_dict.keys())
    race_dict = {key + "3": value for key,
                 value in demo_dict3["Current Year Population, Race"].items()}
    race_df3 = pd.DataFrame([race_dict], columns=race_dict.keys())
    age_dict = {key + "3": value for key,
                value in demo_dict3["Current Year Population, Age"].items()}
    age_df3 = pd.DataFrame([age_dict], columns=age_dict.keys())
    education_dict = {key + "3": value for key,
                      value in demo_dict3["Current Year Population 25+, Education"].items()}
    education_df3 = pd.DataFrame(
        [education_dict], columns=education_dict.keys())
    transport_dict = {key + "3": value for key,
                      value in demo_dict3["Current Year Workers, Transportation to Work"].items()}
    transport_df3 = pd.DataFrame(
        [transport_dict], columns=transport_dict.keys())
    travel_time_dict = demo_dict["Current Year Workers, Travel Time To Work"]
    travel_time_dict = {key + "3": value for key,
                        value in demo_dict3["Current Year Workers, Travel Time To Work"].items()}
    travel_time_df3 = pd.DataFrame(
        [travel_time_dict], columns=travel_time_dict.keys())
    income_dict = {key + "3": value for key,
                   value in demo_dict3["Current Year Households, Household Income"].items()}
    income_df3 = pd.DataFrame([income_dict], columns=income_dict.keys())

    array_3mile_dataframes = [
        psycho_df3, arcgis_df3, gender_df3, race_df3, age_df3, education_df3, transport_df3, travel_time_df3, income_df3]

    # ADD and evaluate all the nearby stores and restaurants to the array.
    # TODO: make less redundant (same method for restaurant and store)
    nearby_stores = google.nearby(lat, lng, 'store', 1)

    categories = pd.DataFrame()
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
                    category, []) + [1]

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
                    category, []) + [1]

    categories = [categories]

    # Create final dataframe (array) for this lcoation
    vector = pd.concat(array_1mile_dataframes +
                       array_3mile_dataframes + categories, axis=1)

    return vector


def _map_difference_to_match(difference):
    # map difference to a match rating between 0 and 100
    difference_max = 88
    difference_min_est = 13
    return utils.translate(difference, difference_max, difference_min_est, 0, 100)


if __name__ == "__main__":
    # print(_generate_location_vector("371 E 2nd Street, LA"))
    print(generate_matches_v1("371 E 2nd Street, LA"))
