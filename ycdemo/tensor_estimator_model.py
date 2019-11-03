from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf
import location_builder as lb
import model_generate_dataset as mg
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
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

    counter = 0
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

        for store_type in retailer.place_type:
            data_row.update({store_type: 1})

        likes, ratings, photo_count, is_valid = lb.get_performance(retailer.name, location.lat, location.lng) # requires location to have long & lat
        data_row.update({"likes": likes, "ratings": ratings, "photo_count": photo_count})

        # counter += 1  # temporary counter

        if not is_valid:
            continue


        # print(counter)

        data_set.append(data_row)

    #  convert to pandas data_frame and remove all the NaNs generated in the creation of the data_frame
    data_set = pd.DataFrame(data_set)
    data_set = data_set.fillna(0)

    # currently no categorical columns, all columns are numerical
    categorical_columns = []
    numerical_columns = []

    for columnName in data_set.columns.values:
        numerical_columns.append(columnName)

    # store data_frame in memory
    with open('data_set.pickle', 'wb') as file:
        # Pickle the 'data' dictionary using the highest protocol available.
        pickle.dump(data_set, file)

    return data_set, categorical_columns, numerical_columns


'''
Function that uses tensorflow estimators to provide a linear regression model for training & final execution 
'''

if __name__ == "__main__":

    def make_input_fn(data_df, label_df, num_epochs=10, shuffle=True, batch_size=32):
        def input_function():
            ds = tf.data.Dataset.from_tensor_slices((dict(data_df), label_df))
            if shuffle:
                ds = ds.shuffle(1000)
            ds = ds.batch(batch_size).repeat(num_epochs)
            return ds

        return input_function

    # FIXME: added callout to use existing model instead of regenerating one using API calls
    df = pd.read_csv('dfog.csv') # to be removed when the above is fixed
    df.drop(columns='Unnamed: 0', inplace=True)
    print(df)

    # # receiving information from picle file for now (future to use mg.build_data_set("New York", 10000))
    # with open('data2.pickle', 'rb') as f:
    #     raw_data_set = pickle.load(f)
    #
    # df, df_catagorical, df_numerical = build_tensor_set(raw_data_set)

    # using ratings as the lavel of success, and removing other success metrics
    likes_target = df.pop("likes")
    photo_target = df.pop("photo_count")

    train_set, test_set = train_test_split(df, test_size=.2)
    train_set, val_set = train_test_split(train_set, test_size=.5)

    # using ratings as the label for success
    train_labels = train_set.pop("ratings")
    val_labels = val_set.pop("ratings")
    test_labels = test_set.pop("ratings")

    # build the estimator feature columns
    df_numerical = []
    for columnName in train_set.columns.values:
        df_numerical.append(columnName)
    feature_columns = []
    for feature_name in df_numerical:
        feature_columns.append(tf.feature_column.numeric_column(feature_name, dtype=tf.float32))

    # TODO: normalize the data set when running large datasets
    # df_stats = df.describe().transpose()
    #
    # def norm(x_data_set):
    #
    #     return (x_data_set - df_stats['mean'])/df_stats['std']
    #
    # df = norm(df)
    #
    # df.to_csv('normalized.csv')

    train_input_fn = make_input_fn(train_set, train_labels)
    eval_input_fn = make_input_fn(val_set, val_labels, num_epochs=1, shuffle=False)
    test_input_fun = make_input_fn(test_set, test_labels, num_epochs=1, shuffle=False)


    def my_mae(labels, predictions):
        mae_metric = tf.keras.metrics.MeanAbsoluteError()
        print(labels)
        print(predictions)
        mae_metric.update_state(y_true=labels, y_pred=predictions['predictions'])
        return {'mae': mae_metric}

    # build & leverage use of a pre-build Linear Regressor leveraging Tensorflow
    linear_est = tf.estimator.LinearRegressor(feature_columns=feature_columns)
    linear_est = tf.estimator.add_metrics(linear_est, my_mae)
    linear_est.train(train_input_fn)
    result = linear_est.evaluate(eval_input_fn)
    print(result)

    final = list(linear_est.predict(test_input_fun))
    print(final)