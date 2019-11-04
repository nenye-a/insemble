import pandas as pd
from mongo_connect import Connect
import matplotlib.pyplot as plt
import numpy as np
import re

"""
File stores communication methods, and functions to communicate and interact with the database for the purposes of
machine learning. Primary activities include creating data from a database, saving or snapshotting existing datasets,
saving models in the database.
"""

client = Connect.get_connection()

'''
Given a length, pull a fresh data set from the data base for testing and validation.

:param length: the number of samples that we wish to pull randomly. If cloning previous data_set, input is ignored
:type int
:param price: do you wish to include prices
:type boolean
:param rating: do you wish to include ratings
:type boolean

:return data_set and list of iDs
'''


def build_data_set(length, price=False, ratings=False, existing_ids=None):

    # initialize our database connections
    db_space = client.spaceData

    if existing_ids:
        db_space_cursor = db_space.dataset2.find({"_id": {"$in": existing_ids}})
    else:
        # get random entries from the database to build for training
        db_space_cursor = db_space.dataset2.aggregate([{"$sample": {"size": length}}])

    # initialize our data set to feed into pandas
    data_ids = set()
    data_set = []

    for db_item in db_space_cursor:

        # store the id of this entry so that we can reconstruct specific training set if necessary
        data_ids.add(db_item["_id"])

        # initialize row that will be added to the database
        data_row = {}

        location = db_item["Location"]
        retailer = db_item["Retailer"]

        # get the location related fields imported
        data_row.update(location["census"])
        data_row.update({"pop": location["pop"]})
        data_row.update({"income": location["income"]})
        #data_row.update(location["nearby"])

        for nearby in location["nearby"]:
            newName = "nearby_" + nearby
            data_row.update({newName: location["nearby"][nearby]})

        # get the retailer related fields
        if price:
            p = db_item["ratings"]
            if np.isnan(p):
                p = -1  # flag that p doesn't exist
            data_row.update({"price": p})
        data_row.update(retailer["place_type"])

        # get performance information
        data_row.update({"likes": db_item["likes"]})
        data_row.update({"photo_count": db_item["photo_count"]})
        if ratings:
            rate = db_item["ratings"]
            if np.isnan(rate):
                continue
            data_row.update({"ratings": rate})

        data_set.append(data_row)

    #  convert to pandas data_frame and remove all the NaNs generated in the creation of the data_frame
    data_set = pd.DataFrame(data_set)
    data_set = data_set.fillna(0)

    # clean up the column names for each row
    data_set.rename(columns=lambda x: re.sub('[^0-9a-zA-Z]+', '_', x), inplace=True)

    categorical_columns = []  # currently no categorical columns

    # return the pandas data_set in addition to list of ids
    return data_set, data_ids, categorical_columns


'''
Saves a list of ids into the database
:param ids: list of ids to save to the dataase

:return True 
'''


def save_data_set(name, ids):

    db_learn = client.learn

    try:
        db_learn.savedSets.insert_one({
            "name": name,
            "saved_ids": list(ids)
        })
    except:
        return False
    return True


'''
Get an existing data_set from the database 
'''

def get_data_set(name):

    db_learn = client.learn

    try:
        db_set = db_learn.savedSets.find_one({"name" : name})
        id_list = db_set["saved_ids"]
    except TypeError:
        print("Could not find value in database... check your spelling!")
        return False

    return build_data_set(1, existing_ids=id_list)


'''
generate label_series and remove anything
'''


def generate_label_series(data_set, desired_label):

    stock_labels = ["ratings", "photo_count", "likes"]
    stock_labels = [x for x in stock_labels if x in list(data_set.columns)]

    try:
        label_series = data_set[desired_label]
    except KeyError:
        print("Label column not in data set")
        return

    df = data_set.drop([x for x in stock_labels if x != desired_label], axis=1)

    return df, label_series


if __name__ == "__main__":

    test, ids, cc  = get_data_set("sk-1")

    data, labels = generate_label_series(test, "photo_count")

    print(data.head())
    print(labels.head())

    print("likes" in list(data.columns))