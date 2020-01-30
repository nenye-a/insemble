import pandas as pd
import geopy.distance
from mongo_connect import Connect
import numpy as np
import math
import re
from location_builder import generate_location_profile
from location_builder import generate_location_profile_new

#pd.set_option('display.max_columns', None)

# TODO: Implement these methods in application code base.

def get_location_details(location_address):
    """
    Given an addresswill generate location profile, and provide the information for the space

    :param location_address:
    :return: location profile
    """

    return generate_location_profile(location_address,0.5)


def get_location_details_new(location_address):
    """
    Given an addresswill generate location profile, and provide the information for the space

    :param location_address:
    :return: location profile
    """

    return generate_location_profile_new(location_address,1)


def loc_to_vector(loc):
    """
    Given a location, this will convert to a vector thats represented in pandas. # This method will turn location
    objects into a vector. It currently ignores lat, lng, traffic, crime, radius
    :param loc: Location item
    :return:
    """

    loc_dict = {}
    loc_dict.update(loc.census)
    loc_dict.update({"pop": loc.pop})
    loc_dict.update({"income": loc.income})
    loc_dict.update(loc.nearby)

    return loc_dict

def location_difference(loc1, loc2):
    """
    Returns the difference between two locations. Location difference is calculated as 4 different numbers:

    - Population
    - Demographic Breakdown
    - Income
    - Categorical Similarity

    a dictionary of each weight is provided

    :param loc1: location in dictionary form
    :param loc2: location in dictionary form
    :return: dictionary of difference between those
    """

    # calculate distance between each location item:
    diff_matrix = pd.DataFrame([loc1, loc2])
    diff_matrix = diff_matrix.fillna(0)
    diff = np.abs(diff_matrix.iloc[1].subtract(diff_matrix.iloc[0]))

    cen_diff = diff.loc[['asian', 'black', 'hispanic', 'indian', 'white', 'multi']].sum()
    pop_diff = diff['pop']
    income_diff = diff['income']
    cat_diff = diff.drop(['asian', 'black', 'hispanic', 'indian', 'white', 'multi', 'pop', 'income']).sum()

    # return matrix
    distances = {"cen_diff": cen_diff, "pop_diff": pop_diff, "income_diff": income_diff, "cat_diff": cat_diff}

    return distances

def generate_location_matches(location_address):
    """
    Given a location, this will generate all the matching retailers within our database that are a match for the profile.
    All items will be ranked by performance (which is considered ranking), accompanied by an algorithmic guess of
    whether or not that retailer will actually be a good match.

    :param location_object: Location object that will be used to generate matches
    :param number_of_matches: number of mataches requested
    :return:
    """

    my_location = get_location_details(location_address)[0]
    my_location_vector = loc_to_vector(my_location)

    client = Connect.get_connection()
    db_space = client.spaceData

    # TODO: make this request less expensive than it currently is. See if we can do some parsing on the mongo side
    db_space_cursor = db_space.dataset2.find({})

    location_retailer_pairs = {}
    distances_items = []
    in_area_retailers = set()

    for item in db_space_cursor:

        # if your already in the area, we don't want to add you as a potential match
        if item["name"] in in_area_retailers:
            continue

        # calculate if item is beyond a certain distance
        my_geo, item_geo = (my_location.lat, my_location.lng), (item["lat"], item["lng"])
        mile_distance = geopy.distance.distance(my_geo, item_geo).miles

        if mile_distance < 0.5: # we don't want those that are less than half a mile
            in_area_retailers.add(item["name"])
            continue

        distances_dict = {}
        item_dict = {}
        id = item["_id"]
        location = item["Location"]

        # store in dictionary for easy retrieval later
        location_retailer_pairs[id] = item

        # compare against our current location
        item_dict.update(location["census"])
        item_dict.update({"pop": location["pop"]})
        item_dict.update({"income": location["income"]})
        for nearby in location["nearby"]:
            new_name = "nearby_" + nearby
            item_dict.update({new_name: location["nearby"][nearby]})

        # store the distance diff and relate to the id
        distances = location_difference(my_location_vector, item_dict)
        distances_dict["id"] = id
        distances_dict["ratings"] = item["ratings"]
        distances_dict.update(distances)
        distances_items.append(distances_dict)

    print("searched")

    distance_table = pd.DataFrame(distances_items)
    distance_stats = distance_table.describe()

    # normalize all the distances
    for diff in distance_table.columns:
        if diff == "id" or diff == "ratings":
            continue
        distance_table[diff] = (distance_table[diff] - distance_stats[diff]["min"]) / \
                               (distance_stats[diff]["max"] - distance_stats[diff]["min"])

    # calculate and trim by weighted difference. Less than 30% diff okay (roughly 1% of all the locations per histogram)
    weight = pd.DataFrame(pd.Series([0.25, 0.20, 0.3, 0.25], index=["cen_diff", "pop_diff", "income_diff", "cat_diff"]))
    distance_table["weighted_diff"] = distance_table[["cen_diff", "pop_diff", "income_diff", "cat_diff"]].dot(weight)
    distance_table = distance_table[distance_table["weighted_diff"] < 0.24]

    # sort by ratings and provide back
    distance_table = distance_table.sort_values("ratings")

    # calculate and return the objects that are the closest organized by ratings
    return_list = []
    for index in range(len(distance_table)):
        index_id = distance_table["id"].iloc[index]
        return_list.append(location_retailer_pairs[index_id])

    return return_list

def generate_tenant_matches(location_address, my_place_type={}):
    """
    Given a location, this will generate all the matching retailers within our database that are a match for the profile.
    All items will be ranked by performance (which is considered ranking), accompanied by an algorithmic guess of
    whether or not that retailer will actually be a good match.

    :param location_object: Location object that will be used to generate matches
    :param number_of_matches: number of mataches requested
    :return:
    """

    my_location = get_location_details(location_address)[0]
    my_location_vector = loc_to_vector(my_location)

    client = Connect.get_connection()
    db_space = client.spaceData

    db_space_cursor = db_space.dataset2.find({})
    # sample_size = 5000
    # db_space_cursor = db_space.dataset2.aggregate([{"$sample": {"size": sample_size}}])

    location_retailer_pairs = {}
    item_rows = []
    in_area_retailers = set()

    count = 0
    for item in db_space_cursor:

        # if your already in the area, we don't want to add you as a potential match
        if item["name"] in in_area_retailers:
            continue

        # calculate if item is beyond a certain distance
        my_geo, item_geo = (my_location.lat, my_location.lng), (item["lat"], item["lng"])
        mile_distance = geopy.distance.distance(my_geo, item_geo).miles

        if mile_distance < 0.5: # we don't want those that are less than half a mile
            in_area_retailers.add(item["name"])
            continue

        count += 1
        print("{} locations and counting".format(count)) if count % 5000 == 0 else 1

        item_id = item["_id"]
        item_dict = {"id": item_id}
        location = item["Location"]

        # store in dictionary for easy retrieval later
        location_retailer_pairs[item_id] = item

        # compare against our current location
        item_dict.update(location["census"])
        item_dict["pop"] = location["pop"]
        item_dict["income"] = location["income"]
        item_dict.update(location["nearby"])

        # convert all nans into nulls

        rate = item["ratings"]
        if np.isnan(rate):
            rate = None

        item_dict["ratings"] = rate
        item_rows.append(item_dict)

    # calculate distance of each item from our vector using pandas objects
    items_df = pd.DataFrame(item_rows)
    my_series = pd.Series(my_location_vector)

    # fill all nas with 1 as this is max distance for all categories
    distance_table = np.abs(items_df.drop(['id', 'ratings'], axis=1).subtract(my_series).fillna(1))

    distance_table['cen_diff'] = distance_table[['asian', 'black', 'hispanic', 'indian', 'white', 'multi']].sum(axis=1)
    distance_table['cat_diff'] = distance_table.drop(
        ['asian', 'black', 'hispanic', 'indian', 'white', 'multi', 'pop', 'income'],
        axis=1).sum(axis=1)

    # re-assign ids & ratings for accurate tracking & sorting
    distance_table = distance_table[['cen_diff', 'cat_diff', 'pop', 'income']]
    distance_table['id'] = items_df['id']
    distance_table['ratings'] = items_df['ratings']

    # normalize all the distances
    distance_stats = distance_table.describe()
    for diff in distance_table.columns:
        if diff == "id" or diff == "ratings":
            continue
        distance_table[diff] = (distance_table[diff] - distance_stats[diff]["min"]) / \
                               (distance_stats[diff]["max"] - distance_stats[diff]["min"])

    # calculate and trim by weighted difference. Less than 30% diff okay (roughly 1% of all the locations per histogram)
    weight = pd.DataFrame([0.2, 0.23, 0.33, 0.24], index=["cen_diff", "pop", "income", "cat_diff"])
    distance_table["weighted_diff"] = distance_table[["cen_diff", "pop", "income", "cat_diff"]].dot(weight)

    decent_rating = 7.8
    diff_cutoff = 0.12
    distance_table = distance_table[distance_table["weighted_diff"] < diff_cutoff]
    distance_table = distance_table[distance_table["ratings"] > decent_rating]

    # sort by ratings
    distance_table = distance_table.sort_values("ratings")

    # calculate and return the objects that are the closest organized by ratings
    return_list = []
    for index in range(len(distance_table)):
        index_id = distance_table["id"].iloc[index]
        location_data = location_retailer_pairs[index_id]
        penalty = 1

        # provide ratings penalty of 5% for every category is in the area:
        for category in my_place_type:
            if category in location_data["Retailer"]["place_type"]:
                penalty -= 0.05

        location_data["map_rating"] = (location_data["ratings"]*penalty)*19/3 + (1-19/3*5)

        if np.isnan(location_data["map_rating"]):
            location_data["map_rating"] = None

        return_list.append(location_data)

    print("Complete.\nMap Size: {}\nDiff Cutoff: {}\nRating Cutoff: {}. ".format(
        len(return_list),
        diff_cutoff,
        decent_rating
    ))
    return return_list

# used by location_heat_map (new alg)
def generate_tenant_matches_by_cat(location_address_list):
    """
    Given a location, this will generate all the matching retailers within our database that are a match for the profile.
    All items will be ranked by performance (which is considered ranking), accompanied by an algorithmic guess of
    whether or not that retailer will actually be a good match.

    :param location_object: Location object that will be used to generate matches
    :param number_of_matches: number of mataches requested
    :return:
    """

    vecs = []
    for location_address in location_address_list:
        location_address = location_address[0]
        my_location = get_location_details(location_address)[0]
        my_location_vector_temp = loc_to_vector(my_location)
        vecs.append(my_location_vector_temp)

    df = pd.DataFrame(vecs)
    my_location_vector = dict(df.mean()) # compute avg vector over all vectors 

    client = Connect.get_connection()
    db_space = client.spaceData

    db_space_cursor = db_space.dataset2.find({})
    # sample_size = 5000
    # db_space_cursor = db_space.dataset2.aggregate([{"$sample": {"size": sample_size}}])

    location_retailer_pairs = {}
    item_rows = []
    in_area_retailers = set()

    count = 0
    for item in db_space_cursor:
        # calculate if item is beyond a certain distance
        my_geo, item_geo = (my_location.lat, my_location.lng), (item["lat"], item["lng"])
        mile_distance = geopy.distance.distance(my_geo, item_geo).miles

        count += 1
        print("{} locations and counting".format(count)) if count % 5000 == 0 else 1

        item_id = item["_id"]
        item_dict = {"id": item_id}
        location = item["Location"]

        # store in dictionary for easy retrieval later
        location_retailer_pairs[item_id] = item

        # compare against our current location
        item_dict.update(location["census"])
        item_dict["pop"] = location["pop"]
        item_dict["income"] = location["income"]
        item_dict.update(location["nearby"])

        # convert all nans into nulls
        rate = item["ratings"]
        if np.isnan(rate):
            rate = None

        item_dict["ratings"] = rate
        item_rows.append(item_dict)

    # calculate distance of each item from our vector using pandas objects
    items_df = pd.DataFrame(item_rows)
    my_series = pd.Series(my_location_vector)

    # fill all nas with 1 as this is max distance for all categories
    distance_table = np.abs(items_df.drop(['id', 'ratings'], axis=1).subtract(my_series).fillna(1))

    distance_table['cen_diff'] = distance_table[['asian', 'black', 'hispanic', 'indian', 'white', 'multi']].sum(axis=1)
    distance_table['cat_diff'] = distance_table.drop(
        ['asian', 'black', 'hispanic', 'indian', 'white', 'multi', 'pop', 'income'],
        axis=1).sum(axis=1)

    # re-assign ids & ratings for accurate tracking & sorting
    distance_table = distance_table[['cen_diff', 'cat_diff', 'pop', 'income']]
    distance_table['id'] = items_df['id']
    distance_table['ratings'] = items_df['ratings']

    # normalize all the distances
    distance_stats = distance_table.describe()
    for diff in distance_table.columns:
        if diff == "id" or diff == "ratings":
            continue
        distance_table[diff] = (distance_table[diff] - distance_stats[diff]["min"]) / \
                               (distance_stats[diff]["max"] - distance_stats[diff]["min"])

    # calculate and trim by weighted difference. Less than 30% diff okay (roughly 1% of all the locations per histogram)
    weight = pd.DataFrame([0.2, 0.23, 0.33, 0.24], index=["cen_diff", "pop", "income", "cat_diff"])
    distance_table["weighted_diff"] = distance_table[["cen_diff", "pop", "income", "cat_diff"]].dot(weight)

    decent_rating = 7.8
    diff_cutoff = 0.12
    distance_table = distance_table[distance_table["weighted_diff"] < diff_cutoff]
    distance_table = distance_table[distance_table["ratings"] > decent_rating]

    # sort by ratings
    distance_table = distance_table.sort_values("ratings")

    # calculate and return the objects that are the closest organized by ratings
    return_list = []
    for index in range(len(distance_table)):
        index_id = distance_table["id"].iloc[index]
        location_data = location_retailer_pairs[index_id]

        return_list.append(location_data)

    print("Complete.\nMap Size: {}\nDiff Cutoff: {}\nRating Cutoff: {}. ".format(
        len(return_list),
        diff_cutoff,
        decent_rating
    ))
    return return_list

spatial_lst = ['Bookish', 'Engine Enthusiasts', 'Green Thumb', 'Natural Beauty', 'Wanderlust', 'Handcrafted', 'Animal Advocates', 'Dog Lovers', 'Smoke Culture', 'Daily Grind', 'Nerd Culture', 'LGBTQ Culture', 'Wealth Signaling', 'Hipster', 'Student Life', 'Farm Culture', 'Love & Romance', 'Happily Ever After', 'Dating Life', 'Connected Motherhood', 'Family Time', 'My Crew', 'Girl Squad', 'Networking', 'Sweet Treats', 'Coffee Connoisseur', 'Trendy Eats', 'Whiskey Business', 'Asian Food & Culture', 'Ingredient Attentive', 'Fueling for Fitness', 'Wine Lovers', 'Hops & Brews', 'Film Lovers', 'Competitive Nature', 'Live Experiences', 'Late-Night Leisure', 'Party Life', 'Live & Local Music', 'Lighthearted Fun', 'Deep Emotions', 'Heartfelt Sharing', 'Awestruck', 'Happy Place', 'Gratitude', 'Memory Lane', 'Dance Devotion', 'Artistic Appreciation', 'Pieces of History', 'Sites to See', 'Hip Hop Culture', 'Mindfulness & Spirituality', 'Activism', 'Politically Engaged', 'Praise & Worship', 'Conservation', 'Civic Attentiveness', 'Trend Trackers', 'All About Hair', "Men's Style", 'Fitness Fashion', 'Body Art', 'Smart Chic', 'Home & Leisure', 'Past Reflections', 'Humanitarian', 'Deal Seekers', 'Organized Sports', 'Fitness Obsession', 'Outdoor Adventures', 'Yoga Advocates', 'Functional Fitness']

gender_lst = ["Current Year Population, Female", "Current Year Population, Male"]

age_lst = ["Current Year Population, Age 0 - 4","Current Year Population, Age 10 - 14","Current Year Population, Age 15 - 17","Current Year Population, Age 18 - 20","Current Year Population, Age 21 - 24","Current Year Population, Age 25 - 34","Current Year Population, Age 35 - 44","Current Year Population, Age 45 - 54","Current Year Population, Age 5 - 9","Current Year Population, Age 55 - 64","Current Year Population, Age 65+"]

race_lst = ["Current Year Population, American Indian/Alaskan Native Alone","Current Year Population, American Indian/Alaskan Native Alone Or In Combination","Current Year Population, American Indian/Alaskan Native Alone, Female","Current Year Population, American Indian/Alaskan Native Alone, Male","Current Year Population, Asian Alone","Current Year Population, Asian Alone Or In Combination","Current Year Population, Asian Alone, Female","Current Year Population, Asian Alone, Male","Current Year Population, Black/African American Alone","Current Year Population, Black/African American Alone Or In Combination","Current Year Population, Black/African American Alone, Female","Current Year Population, Black/African American Alone, Male","Current Year Population, Female","Current Year Population, Male","Current Year Population, Native Hawaiian/Pacific Islander Alone","Current Year Population, Native Hawaiian/Pacific Islander Alone Or In Combination","Current Year Population, Native Hawaiian/Pacific Islander Alone, Female","Current Year Population, Native Hawaiian/Pacific Islander Alone, Male","Current Year Population, Some Other Race Alone","Current Year Population, Some Other Race Alone Or In Combination","Current Year Population, Some Other Race Alone, Female","Current Year Population, Some Other Race Alone, Male","Current Year Population, White Alone","Current Year Population, White Alone Or In Combination","Current Year Population, White Alone, Female","Current Year Population, White Alone, Male"]

travel_time_lst = ["Current Year Workers, Travel Time To Work: 15 - 29 Minutes","Current Year Workers, Travel Time To Work: 30 - 44 Minutes","Current Year Workers, Travel Time To Work: < 15 Minutes"]

transport_lst = ["Current Year Workers, Transportation To Work: Public Transport","Current Year Workers, Transportation to Work: Bicycle","Current Year Workers, Transportation to Work: Carpooled","Current Year Workers, Transportation to Work: Drove Alone","Current Year Workers, Transportation to Work: Walked","Current Year Workers, Transportation to Work: Worked at Home"] 

# 01/29/20 dl
def generate_tenant_matches_new(location_address, my_place_type={}):
    """
    Given a location, this will generate all the matching retailers within our database that are a match for the profile.
    All items will be ranked by performance (which is considered ranking), accompanied by an algorithmic guess of
    whether or not that retailer will actually be a good match.

    :param location_object: Location object that will be used to generate matches
    :param number_of_matches: number of mataches requested
    :return:
    """

    # get my vector 
    my_location_df = generate_location_profile_new(location_address)

    # get preprocessed vectors 
    client = Connect.get_connection()
    db_space = client.spaceData
    df = pd.DataFrame(list(db_space.preprocessed_vectors.find()))
    df2 = df.drop(columns=["_id", "lat", "lng", "loc_id"])

    # subtract my vector
    df2 = df2.append(my_location_df)
    df2 = df2.fillna(0)
    diff = df2.subtract(df2.iloc[-1])

    # group into main features
    diff["psycho"] = diff[spatial_lst].sum(axis=1)
    diff["gender"] = diff[gender_lst].sum(axis=1)
    diff["race"] = diff[race_lst].sum(axis=1)
    diff["age"] = diff[age_lst].sum(axis=1)
    diff["travel_time"] = diff[travel_time_lst].sum(axis=1)
    diff["transport"] = diff[transport_lst].sum(axis=1)
    print(diff)

    # normalize between 0 and 1
    #diff_alt = diff.drop(columns=['lat', 'lng', 'loc_id'])
    diff_alt = diff
    norm_df = (diff_alt - diff_alt.min()) / (diff_alt.max() - diff_alt.min())   
    norm_df['lat'], norm_df['lng'], norm_df['loc_id'] = df['lat'], df['lng'], df['loc_id']
    print(norm_df)

    # find sum of diffs
    norm_df["error_sum"] = norm_df[["psycho", "TotalHouseholds", "DaytimePop", "DaytimeWorkingPop", "MedHouseholdIncome", "gender", "race", "age", "travel_time", "transport"]].sum(axis=1)

    # return only locations that work 
    norm_df = norm_df[:-1] 
    best = norm_df.nsmallest(int(norm_df.shape[0] * 0.03), 'error_sum')

    print(best[['lat', 'lng', 'loc_id']])
    return best[['lat', 'lng', 'loc_id']]

def generate_tenant_matches_by_cat(location_address_list):
    """
    Given a location, this will generate all the matching retailers within our database that are a match for the profile.
    All items will be ranked by performance (which is considered ranking), accompanied by an algorithmic guess of
    whether or not that retailer will actually be a good match.

    :param location_object: Location object that will be used to generate matches
    :param number_of_matches: number of mataches requested
    :return:
    """

    vecs = []
    for location_address in location_address_list:
        location_address = location_address[0]
        my_location = get_location_details(location_address)[0]
        my_location_vector_temp = loc_to_vector(my_location)
        vecs.append(my_location_vector_temp)

    df = pd.DataFrame(vecs)
    my_location_vector = dict(df.mean()) # compute avg vector over all vectors 

    client = Connect.get_connection()
    db_space = client.spaceData

    db_space_cursor = db_space.dataset2.find({})
    # sample_size = 5000
    # db_space_cursor = db_space.dataset2.aggregate([{"$sample": {"size": sample_size}}])

    location_retailer_pairs = {}
    item_rows = []
    in_area_retailers = set()

    count = 0
    for item in db_space_cursor:
        # calculate if item is beyond a certain distance
        my_geo, item_geo = (my_location.lat, my_location.lng), (item["lat"], item["lng"])
        mile_distance = geopy.distance.distance(my_geo, item_geo).miles

        count += 1
        print("{} locations and counting".format(count)) if count % 5000 == 0 else 1

        item_id = item["_id"]
        item_dict = {"id": item_id}
        location = item["Location"]

        # store in dictionary for easy retrieval later
        location_retailer_pairs[item_id] = item

        # compare against our current location
        item_dict.update(location["census"])
        item_dict["pop"] = location["pop"]
        item_dict["income"] = location["income"]
        item_dict.update(location["nearby"])

        # convert all nans into nulls
        rate = item["ratings"]
        if np.isnan(rate):
            rate = None

        item_dict["ratings"] = rate
        item_rows.append(item_dict)

    # calculate distance of each item from our vector using pandas objects
    items_df = pd.DataFrame(item_rows)
    my_series = pd.Series(my_location_vector)

    # fill all nas with 1 as this is max distance for all categories
    distance_table = np.abs(items_df.drop(['id', 'ratings'], axis=1).subtract(my_series).fillna(1))

    distance_table['cen_diff'] = distance_table[['asian', 'black', 'hispanic', 'indian', 'white', 'multi']].sum(axis=1)
    distance_table['cat_diff'] = distance_table.drop(
        ['asian', 'black', 'hispanic', 'indian', 'white', 'multi', 'pop', 'income'],
        axis=1).sum(axis=1)

    # re-assign ids & ratings for accurate tracking & sorting
    distance_table = distance_table[['cen_diff', 'cat_diff', 'pop', 'income']]
    distance_table['id'] = items_df['id']
    distance_table['ratings'] = items_df['ratings']

    # normalize all the distances
    distance_stats = distance_table.describe()
    for diff in distance_table.columns:
        if diff == "id" or diff == "ratings":
            continue
        distance_table[diff] = (distance_table[diff] - distance_stats[diff]["min"]) / \
                               (distance_stats[diff]["max"] - distance_stats[diff]["min"])

    # calculate and trim by weighted difference. Less than 30% diff okay (roughly 1% of all the locations per histogram)
    weight = pd.DataFrame([0.2, 0.23, 0.33, 0.24], index=["cen_diff", "pop", "income", "cat_diff"])
    distance_table["weighted_diff"] = distance_table[["cen_diff", "pop", "income", "cat_diff"]].dot(weight)

    decent_rating = 7.8
    diff_cutoff = 0.12
    distance_table = distance_table[distance_table["weighted_diff"] < diff_cutoff]
    distance_table = distance_table[distance_table["ratings"] > decent_rating]

    # sort by ratings
    distance_table = distance_table.sort_values("ratings")

    # calculate and return the objects that are the closest organized by ratings
    return_list = []
    for index in range(len(distance_table)):
        index_id = distance_table["id"].iloc[index]
        location_data = location_retailer_pairs[index_id]

        return_list.append(location_data)

    print("Complete.\nMap Size: {}\nDiff Cutoff: {}\nRating Cutoff: {}. ".format(
        len(return_list),
        diff_cutoff,
        decent_rating
    ))
    return return_list


def location_heat_map(retail_data):
    """
    receives retailer object, and returns list of places that correspond to locations of interest

    :param retail_data: dictionary of the following form
    request.data = {
        "income": 120,000,
        "categories": ["restaurant", "pizza"],
    }

    :return: object of the following form:
    result = {
        "length": sizeOfResults,        # size of results
        "results": [{                   # list of all heatmap points
            "lat": latitude_value,      # latitude of point
            "lng": longitude_value,     # longitude of point
            "map_rating": heat          # heat will range from 1-20
        },{
            "lat": latitude_value,
            "lng": longitude_value,
            "map_rating":
        }]
    }
    """
    client = Connect.get_connection()
    db_space = client.spaceData

    data = {}
    data["income"] = retail_data["income"]
    for category in retail_data["categories"]:
        data[category] = 1

    # query our database for samples to evaluate
    db_space_cursor = db_space.dataset2.find({}) # grab the whole database

    # samples_size = 200  # 200 points only for testing purposes
    # db_space_cursor = db_space.dataset2.aggregate([{"$sample": {"size": samples_size}}])

    # Loop to determine closest retailer to base request off of.
    distance_list = []
    for item in db_space_cursor:

        location = item["Location"]
        retailer = item["Retailer"]

        item_dict = {}
        id = item["_id"]

        item_dict["id"] = id
        item_dict.update(retailer["place_type"])
        item_dict["place_type"] = retailer["place_type"]
        item_dict["address"] = location["address"]
        item_dict["income"] = location["income"]
        item_dict["ratings"] = item["ratings"]

        distance_list.append(item_dict)

    distance_df = pd.DataFrame(distance_list)
    data_series = pd.Series(data)

    diff_df = distance_df.drop(['id', 'ratings', 'address', 'place_type'], axis=1).subtract(data_series).fillna(1)
    distance_df['type_diff'] = diff_df.drop(['income'], axis=1).sum(axis=1)

    # normalize all the distances
    distance_stats = distance_df.describe()
    for diff in distance_df.columns:
        if diff == "id" or diff == "place_type" or diff == "address" or diff == "ratings":
            continue
        distance_df[diff] = (distance_df[diff] - distance_stats[diff]["min"]) / \
                            (distance_stats[diff]["max"] - distance_stats[diff]["min"])

    # select best rated item within distance
    weight = pd.DataFrame([0.6, 0.4], index=["income", "type_diff"])
    distance_df["weighted_diff"] = distance_df[["income", "type_diff"]].dot(weight)
    distance_df = distance_df[distance_df["weighted_diff"] < 0.2]

    # generate tenant matches based in info
    comparable_item = distance_df.loc[distance_df["ratings"].idxmax()]
    print(comparable_item)
    return generate_tenant_matches(comparable_item.loc["address"], comparable_item.loc["place_type"])


# location_heat_map function for new algorithm, which only considers first category of store (DL) 
def location_heat_map_by_cat(retail_data):
    """
    receives retailer object, and returns list of places that correspond to locations of interest

    :param retail_data: dictionary of the following form
    request.data = {
        "income": 120,000,
        "categories": ["restaurant", "pizza"],
    }

    :return: object of the following form:
    result = {
        "length": sizeOfResults,        # size of results
        "results": [{                   # list of all heatmap points
            "lat": latitude_value,      # latitude of point
            "lng": longitude_value,     # longitude of point
            "map_rating": heat          # heat will range from 1-20
        },{
            "lat": latitude_value,
            "lng": longitude_value,
            "map_rating":
        }]
    }
    """
    # get whole data base 
    client = Connect.get_connection()
    db_space = client.spaceData

    db_space_cursor = db_space.dataset2.find({})

    # samples_size = 200  # 200 points only for testing purposes
    # db_space_cursor = db_space.dataset2.aggregate([{"$sample": {"size": samples_size}}])

    all_tenant_matches = []
    # loop thru all categories
    for category in retail_data["categories"]:
        print(category)

        # loop thru all existing stores to determine stores that fall into 1st category 
        similar_stores = []
        db_space_cursor.rewind()
        for item in db_space_cursor:
            if category in item["Retailer"]["place_type"]:
                item_dict = {}
                item_dict["address"] = item["Location"]["address"]
                item_dict["place_type"] = item["Retailer"]["place_type"]
                item_dict["ratings"] = item["ratings"]
                similar_stores.append(item_dict)

        df = pd.DataFrame(similar_stores)

        # find top 10%
        df = df.dropna()
        n = int(df.shape[0] * 0.1)
        df = df.nlargest(n, "ratings")
        df = df[["address"]]
    
        address_list = df.to_numpy()
        new_matches = generate_tenant_matches_2(address_list)
        all_tenant_matches += new_matches

    return new_matches

if __name__ == '__main__':
#     generate_location_profile("Los Angeles")
#    location_heat_map({
#        "income": 100000,
#        "categories": ["Restaurant", "Chinese Restaurant"],
#    })

    #df=generate_tenant_matches_new("3321 S La Cienega Blvd, Los Angeles, CA")
    df=generate_tenant_matches_new("1004 W Slauson Ave, Los Angeles, CA 90044")
    df.to_csv("space1_matches.csv")




