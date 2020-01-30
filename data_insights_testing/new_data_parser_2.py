import pandas as pd
import numpy as np
import tensorflow as tf
import math
from os import listdir
# %mathplotlib inline
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras import regularizers
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import GRU
from tensorflow.keras.layers import Flatten
from tensorflow.keras.layers import Conv1D
from tensorflow.keras.layers import MaxPooling1D
from tensorflow.keras.layers import Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.optimizers import SGD
from tensorflow.keras.optimizers import RMSprop
from tensorflow.keras.models import load_model
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.layers import Bidirectional
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.utils import plot_model
from tensorflow.keras.layers import TimeDistributed
from tensorflow.keras.layers import RepeatVector
from tensorflow.keras.callbacks import LearningRateScheduler
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score
from sklearn import preprocessing
from sklearn.preprocessing import MinMaxScaler
import h5py
# from trains import Task
from tensorflow.keras import backend as K
import insemble_data_tools as idt
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from pymongo import MongoClient
from decouple import config
import urllib
import sys

# MONGO_USER = config("MONGO_USER")
# MONGO_PASS = config("MONGO_DB_PASS")


def process_data():

    def get_connection():
        mongo_uri = "mongodb+srv://" + urllib.parse.quote(MONGO_USER) + ":" + urllib.parse.quote(
            MONGO_PASS) + "@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE"
        return MongoClient(mongo_uri)

    #pd.set_option('display.max_rows', None)  # or 1000

    MONGO_USER = 'doron'
    MONGO_PASS = '0sQQCT8PVz4neoiI'

    client = get_connection()
    db = client.spaceData
    collections = db.spaces
    print("Total records for the collection" + ' ' + str(collections.count()))
    results = collections.find().limit(100000)
    indf = pd.DataFrame(list(results))
    print(indf)
    print(list(indf))
    #df.to_csv("Mega_DataFrame.csv")
    #df = pd.read_csv("Mega_DataFrame.csv")
    #print(df.head())

    outdf = pd.DataFrame()
    #indf = pd.read_csv("Mega_DataFrame.csv",nrows=100)


    # NEARBY POIS 
    #for i, row in indf.iterrows():
    #    lst = row.loc["nearby_store"]
    #    if type(lst) is not list:
    #        continue
    #    count = 0
    #    for place in lst:
    #        dis = place["distance"]
    #        if dis < 0.5:

#    # CATEGORIES 
#    # make cat set 
#    catset = set()
#    for cats in indf["types"]:
#        for cat in cats:
#            if cat not in ["establishment", "point_of_interest", "store"]:
#                catset.add(cat)
#    for cats in indf["foursquare_categories"]:
#        if type(cats) is not list or len(cats) == 0:
#            continue
#        d = cats[0]
#        cat = d["category_name"].lower().replace(" ", "_")
#        catset.add(cat)
#
#    # determine if each place falls into each cat
#    for i, row in indf.iterrows():
#        print("Making categories features", i)
#        for cat in catset:
#            # check foursquare cat
#            cats = row.loc["foursquare_categories"]
#            if type(cats) is list and len(cats) != 0:
#                if cat in cats[0]["category_name"].lower().replace(" ", "_"):
#                    outdf.set_value(i, cat, 1)
#                    continue
#            # check types cat
#            if cat in row.loc["types"]:
#                outdf.set_value(i, cat, 1)
#                continue
#            # set 0s
#            outdf.set_value(i, cat, 0)

    # LAT, LONG
    for i, row in indf.iterrows():
        lat = row.loc["geometry"]["location"]["lat"]
        lng = row.loc["geometry"]["location"]["lng"]
        outdf.set_value(i, "lat", lat)
        outdf.set_value(i, "lng", lng)

    # DEMOGRAPHICS + PSYCHOGRAPHICS  
    for i, row in indf.iterrows():
        print("Making demo and psycho features", i)
        big_dict = row.loc["demo1"]
        if type(big_dict) is dict:
            for big_key in big_dict:
                item = big_dict[big_key]
                if type(item) is dict:
                    for key in item:
                        outdf.set_value(i, key, item[key])
                else:
                    outdf.set_value(i, big_key, item)

        big_dict = row.loc["demo3"]
        if type(big_dict) is dict:
            for big_key in big_dict:
                item = big_dict[big_key]
                if type(item) is dict:
                    for key in item:
                        outdf.set_value(i, key + " 3", item[key])
                else:
                    outdf.set_value(i, big_key + " 3", item)

        big_dict = row.loc["psycho1"]
        if type(big_dict) is dict:
            for big_key in big_dict:
                item = big_dict[big_key]
                if type(item) is dict:
                    for key in item:
                        outdf.set_value(i, key, item[key])
                else:
                    outdf.set_value(i, big_key, item)

        big_dict = row.loc["psycho3"]
        if type(big_dict) is dict:
            for big_key in big_dict:
                item = big_dict[big_key]
                if type(item) is dict:
                    for key in item:
                        outdf.set_value(i, key + " 3", item[key])
                else:
                    outdf.set_value(i, big_key + " 3", item)

    # ARCGIS
    for i, row in indf.iterrows():
        print("Making arcgis features", i)
        agdict = row.loc["arcgis_details1"]
        if type(agdict) is dict:
            for key in agdict:
                outdf.set_value(i, key[:-1], agdict[key])

        agdict = row.loc["arcgis_details3"]
        if type(agdict) is dict:
            for key in agdict:
                outdf.set_value(i, key[:-1], agdict[key])

    # NUM RATINGS, RATING
    for i, row in indf.iterrows():
        print("Making ratings output features", i)
        num_ratings = row.loc["user_ratings_total"]
        if type(num_ratings) is float:
            outdf.set_value(i, "num_google_ratings", num_ratings)
        star_rating = row.loc["rating"]
        if type(star_rating) is float:
            outdf.set_value(i, "google_star_rating", star_rating)

    # LOC_ID
    for i, row in indf.iterrows():
        outdf.set_value(i, "loc_id", row.loc["_id"])

    # drop cols without info 
    outdf = outdf.dropna()

    #print(outdf)
    #print(list(outdf))

    outdf.to_csv("data_for_vectors.csv")

    return outdf

def rows_to_consider(df):
    df = df.values
    counter = 0
    rows = []
    for val in df[:, 7]:
        if val > 0:
            rows.append(counter)
        counter += 1
    return rows

# sales_rows = rows_to_consider(df)
# print(sales_rows)

def find_all_categories(df):
    categories = set()
    for cat_list in df.values[:, 6]:
        for cat in cat_list:
            print(cat)
            if cat == 'point_of_interest':
                break
            categories.add(cat)
    # for cat_list2 in df.values[:, 12]:
    #     try:
    #         print(type(cat_list2))
    #     except:
    #         continue

# categories = find_all_categories(df)
# print(categories)


if __name__ == "__main__":
    process_data()

    df = pd.read_csv("data_for_vectors.csv")
    #for i, j in enumerate(list(df)):
    #    print(i, j)


