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
    # pending debugging in estimator_model
    return data_set


'''
Function that builds and provides a very simple Keras model for training.
'''

def get_simple_k_model():
    model = keras.Sequential([
        keras.layers.Dense(16, activation="relu"),
        keras.layers.Dense(16, activation="relu"),
        keras.layers.Dense(1)
    ])

    optimizer = tf.keras.optimizers.RMSprop(0.001)

    model.compile(loss='mse',
                  optimizer=optimizer,
                  metrics=['mae', 'mse'])

    return model

'''
Function that uses tensorflow estimators to provide a linear regression model for training & final execution 
'''


if __name__ == "__main__":

    # receiving information from New York for now
    raw_data_set = mg.build_data_set("New York", 50)
    df, df_catagorical, df_numerical = build_tensor_set(raw_data_set)

    likes_target = df.pop("likes")
    ratings_target = df.pop("ratings")
    photo_target = df.pop("photo_count")

    # only receiving ratings for the near term. Generate actual data set (needed if not using input funciton)
    dataset = tf.data.Dataset.from_tensor_slices((df.values, ratings_target.values))

    full_dataset = dataset.shuffle()
    train_dataset = full_dataset.take(100)
    test_dataset = full_dataset.skip(100)
    val_dataset = test_dataset.take(100)
    test_dataset = test_dataset.skip(100)


    print(result)

    return
