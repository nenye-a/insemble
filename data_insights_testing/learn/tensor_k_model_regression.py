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
    return input_data_set


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
Function that uses tensorflow keras to provide a linear regression model for training & final execution 
'''


if __name__ == "__main__":
    # TODO a lot!
    K = 1
