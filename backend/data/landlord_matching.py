from . import utils
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

AWS_ACCESS_KEY_ID = settings.AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = settings.AWS_SECRET_ACCESS_KEY

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


def generate_matches(location_address, name=None, my_place_type={}):
    pass


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
    # map difference to a match rating between 0 and 100
    difference_max = 1
    difference_min_est = 0.145

    # previous values
    # difference_max = 88
    # difference_min_est = 13

    return utils.translate(difference, difference_max, difference_min_est, 0, 100)
