import utils
import pandas as pd
import api.goog as google
import api.spatial as spatial
import api.arcgis as arcgis
import api.environics as environics

'''

This file is the main matching engine for the insemble application.
All outward boundmatching capabilities and functions are mappted 
through this application.

'''

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

GENDER_LIST = ["Current Year Population, Female",
               "Current Year Population, Male"]

AGE_LIST = ["Current Year Population, Age 0 - 4", "Current Year Population, Age 10 - 14",
            "Current Year Population, Age 15 - 17", "Current Year Population, Age 18 - 20",
            "Current Year Population, Age 21 - 24", "Current Year Population, Age 25 - 34",
            "Current Year Population, Age 35 - 44", "Current Year Population, Age 45 - 54",
            "Current Year Population, Age 5 - 9", "Current Year Population, Age 55 - 64",
            "Current Year Population, Age 65+"]

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
             "Current Year Population, Female", "Current Year Population, Male",
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

TRAVEL_TIME_LIST = ["Current Year Workers, Travel Time To Work: 15 - 29 Minutes",
                    "Current Year Workers, Travel Time To Work: 30 - 44 Minutes",
                    "Current Year Workers, Travel Time To Work: < 15 Minutes"]

TRANSPORT_LIST = ["Current Year Workers, Transportation To Work: Public Transport",
                  "Current Year Workers, Transportation to Work: Bicycle",
                  "Current Year Workers, Transportation to Work: Carpooled",
                  "Current Year Workers, Transportation to Work: Drove Alone",
                  "Current Year Workers, Transportation to Work: Walked",
                  "Current Year Workers, Transportation to Work: Worked at Home"]


def generate_matches_v1(location_address, my_place_type={}):
    """

    Given an address, will generate a ranking of addresses that are the most similar
    accross all aspects to this location.

    """

    # get my vector
    my_location_df = _generate_location_vector(location_address)

    # get preprocessed vectors
    df = pd.DataFrame(list(utils.DB_VECTORS.find()))
    df2 = df.drop(columns=["_id", "lat", "lng", "loc_id"])

    # subtract my vector
    df2 = df2.append(my_location_df)
    df2 = df2.fillna(0)
    diff = df2.subtract(df2.iloc[-1])

    # group into main features
    diff["psycho"] = diff[SPATIAL_LIST].sum(axis=1)
    diff["gender"] = diff[GENDER_LIST].sum(axis=1)
    diff["race"] = diff[RACE_LIST].sum(axis=1)
    diff["age"] = diff[AGE_LIST].sum(axis=1)
    diff["travel_time"] = diff[TRAVEL_TIME_LIST].sum(axis=1)
    diff["transport"] = diff[TRANSPORT_LIST].sum(axis=1)
    # print(diff)

    # normalize between 0 and 1
    diff_alt = diff
    norm_df = (diff_alt - diff_alt.min()) / (diff_alt.max() - diff_alt.min())
    norm_df['lat'], norm_df['lng'], norm_df['loc_id'] = df['lat'], df['lng'], df['loc_id']
    print(norm_df)

    # find sum of diffs
    norm_df["error_sum"] = norm_df[["psycho", "TotalHouseholds", "DaytimePop", "DaytimeWorkingPop",
                                    "MedHouseholdIncome", "gender", "race", "age", "travel_time", "transport"]].sum(axis=1)

    # return only locations that work (top 1%)
    norm_df = norm_df[:-1]
    best = norm_df.nsmallest(int(norm_df.shape[0] * 0.01), 'error_sum')

    return best[['lat', 'lng', 'loc_id']].to_json(orient='records')


# Given an address, generates a vector of a location that can be used
# to compare against vectors stored in mongodb.
def _generate_location_vector(address):

    # get lat long
    location = google.find(address)
    lat = location["geometry"]["location"]["lat"]
    lng = location["geometry"]["location"]["lng"]

    # get data
    cats, spatial_df = spatial.create_spatial_cats_and_df()
    block_df = spatial.create_block_grp_df()
    psycho_dict = spatial.get_psychographics(
        lat, lng, 1, spatial_df, block_df, cats)

    arcgis_dict = arcgis.details(lat, lng, 1)

    cats, demo_df = environics.create_demo_cats_and_df()
    demo_dict = environics.get_demographics(
        lat, lng, 1, demo_df, block_df, cats)

    # create arr as df
    # psycho
    psycho_df = pd.DataFrame([psycho_dict], columns=psycho_dict.keys())

    # arcgis - num households, daytime pop, daytime working pop, income
    arcgis_df = pd.DataFrame([arcgis_dict], columns=arcgis_dict.keys())
    arcgis_df = arcgis_df.drop(
        columns=["HouseholdGrowth2017-2022", "DaytimeResidentPop"])
    num_households_df = arcgis_df["TotalHouseholds"]
    daytime_pop_df = arcgis_df["DaytimePop"]
    daytime_working_pop_df = arcgis_df["DaytimeWorkingPop"]
    income_df = arcgis_df["MedHouseholdIncome"]

    # demo - gender, race, age, travel time, transport methods
    gender_dict = demo_dict["Current Year Population, Gender"]
    gender_df = pd.DataFrame([gender_dict], columns=gender_dict.keys())
    race_dict = demo_dict["Current Year Population, Race"]
    race_df = pd.DataFrame([race_dict], columns=race_dict.keys())
    age_dict = demo_dict["Current Year Population, Age"]
    age_df = pd.DataFrame([age_dict], columns=age_dict.keys())
    transport_dict = demo_dict["Current Year Workers, Transportation to Work"]
    transport_df = pd.DataFrame(
        [transport_dict], columns=transport_dict.keys())
    travel_time_dict = demo_dict["Current Year Workers, Travel Time To Work"]
    travel_time_df = pd.DataFrame(
        [travel_time_dict], columns=travel_time_dict.keys())

    # create final df
    df = pd.concat([psycho_df, num_households_df, daytime_pop_df, daytime_working_pop_df,
                    income_df, gender_df, race_df, age_df, transport_df, travel_time_df], axis=1)

    return df
