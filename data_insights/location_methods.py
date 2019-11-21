import pandas as pd
import geopy.distance
from mongo_connect import Connect
# import matplotlib.pyplot as plt
import numpy as np
import math
import re
from location_builder import generate_location_profile


# TODO: Implement these methods in application code base.

def get_location_details(location_address):
    """
    Given an addresswill generate location profile, and provide the information for the space

    :param location_address:
    :return: location profile
    """

    return generate_location_profile(location_address,0.5)

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

    for nearby in loc.nearby:
        new_name = "nearby_" + nearby
        loc_dict.update({new_name: loc.nearby[nearby]})

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

    # TODO: make this request less expensive than it currently is. See if we can do some parsing on the mongo side
    # db_space_cursor = db_space.dataset2.find({})
    db_space_cursor = db_space.dataset2.aggregate([{"$sample": {"size": 3000}}])

    location_retailer_pairs = {}
    distances_items = []
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
        print(count)
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

        # convert all nans into nulls
        rate = item["ratings"]
        if np.isnan(rate):
            rate = None
        distances_dict["ratings"] = rate

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

    # sort by ratings
    distance_table = distance_table.sort_values("ratings")

    # calculate and return the objects that are the closest organized by ratings
    return_list = []
    for index in range(len(distance_table)):
        index_id = distance_table["id"].iloc[index]
        location_data = location_retailer_pairs[index_id]
        penalty = 1

        # provide ratings penalty of 10% for every category is in the area:
        for category in my_place_type:
            if category in location_data["Retailer"]["place_type"]:
                penalty -= 0.1

        location_data["map_rating"] = (location_data["ratings"]*penalty)*19/3 + (1-19/3*5)

        if np.isnan(location_data["map_rating"]):
            location_data["map_rating"] = None

        return_list.append(location_data)

    print("#################################################################################")
    print(len(return_list))
    return return_list

# if __name__ == '__main__':
#     generate_location_profile("Los Angeles")
