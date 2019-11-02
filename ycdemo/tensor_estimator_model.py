from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf
import location_builder as lb
import model_generate_dataset as mg
import pickle
import numpy as np
import pandas as pd
import sklearn as sk
from tensorflow import keras


'''
Function receives linked data base of location, retailers to performance and builds data sets that can be monitored
and evaluated by tensor flow. Retailer categories are displayed as multi-hot arrays within the database. If

:param input_data_set: list of tuples containing retailers, their locations, and their performance (in a tuple)
:type list

:return tuple containing the data set, and the categorical and numerical columns for the data_set
:rtype tuple(tf.Dataset, array [categorical], array [numerical])
'''


def build_tensor_set(input_data_set):

    data_set = []
    for location, retailer in input_data_set:

        data_row = {}

        # get the general information imported
        data_row.update(location.census)
        data_row.update({"population": location.pop})
        data_row.update({"income": location.income})
        data_row.update({"traffic": location.traffic})
        # data_row.update({"safety": location.safety}) # not ready yet
        # data_row.update({"radius": location.radius}) # not ready yet
        data_row.update(location.nearby)

        # get general information for retailer imported to data set
        data_row.update({"cost": retailer.cost})

        # TODO remove try once data is updated to no longer provide NANs
        try:
            for store_type in retailer.place_type:
                data_row.update({store_type: 1})
        except:
            continue

        l, r, p = lb.get_performance(retailer.name, location.lat,
                                                         location.lng)  # test line

        print(l)

        # let's get the performance of a specific retailer lat & longitude. If not successful, let's move on
        try:
            print("Got it")
            likes, ratings, photo_count = lb.get_performance(retailer.name, location.lat, location.lng) # requires location to have long & lat
            print("No Exceptions")
            data_row.update({"likes": likes, "ratings": ratings, "photo_count": photo_count})
        except:
            continue

        data_set.append(data_row)

    #  convert to pandas data_frame and remove all the NaNs generated in the creation of the data_frame
    data_set = pd.DataFrame(data_set)
    data_set.fillna(0)

    # currently no categorical columns, all columns are numerical
    categorical_columns = []
    numerical_columns = []

    for columnName in data_set.columns.values:
        numerical_columns.append(columnName)

    return data_set, categorical_columns, numerical_columns

'''
Function that uses tensorflow estimators to provide a linear regression model for training & final execution 
'''

if __name__ == "__main__":

    def make_input_fn(data, num_epochs=10, shuffle=True, batch_size=32):
        def input_function():
            new_ds = data
            if shuffle:
                new_ds = new_ds.shuffle(1000)
            new_ds = new_ds.batch(batch_size).repeat(num_epochs)
            return new_ds
        return input_function

    # receiving information from picle file for now (future to use mg.build_data_set("New York", 10000))
    with open('data.pickle', 'rb') as f:
        raw_data_set = pickle.load(f)

    df, df_catagorical, df_numerical = build_tensor_set(raw_data_set)

    # build the estimator feature columns
    feature_columns = []
    for feature_name in df_numerical:
        feature_columns.append(tf.feature_column.numeric_column(feature_name, dtype=tf.float32))

    likes_target = df.pop("likes")
    ratings_target = df.pop("ratings")
    photo_target = df.pop("photo_count")

    # TODO: normalize the data set

    df_stats = df.describe().transpose()

    def norm(x_data_set):
        return (x_data_set - df_stats['mean'])/df_stats['std']

    df = norm(df)

    # only receiving ratings for the near term. Generate actual data set (needed if not using input funciton)
    dataset = tf.data.Dataset.from_tensor_slices((df.values, ratings_target.values))

    full_dataset = dataset.shuffle()
    train_dataset = full_dataset.take(15)
    test_dataset = full_dataset.skip(15)
    val_dataset = test_dataset.take(15)
    test_dataset = test_dataset.skip(100)

    train_input_fn = make_input_fn(train_dataset)
    eval_input_fn = make_input_fn(val_dataset, num_epochs=1, shuffle=False)
    # test_input_fun = make_input_fn(test_dataset, num_epochs=1, shuffle=False)

    # build & leverage use of a pre-build Linear Regressor leveraging Tensorflow
    linear_est = tf.estimator.LinearClassifier(feature_columns=feature_columns)
    linear_est.train(train_input_fn)
    result = linear_est.evaluate(eval_input_fn)

    print(result)