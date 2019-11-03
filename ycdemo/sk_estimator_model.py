from __future__ import absolute_import, division, print_function, unicode_literals
import location_builder as lb
import model_generate_dataset as mg
import pickle
import numpy as np
import pandas as pd
import sklearn as sk
from sklearn.model_selection import train_test_split
from sklearn import linear_model

"""
File for creating and evaluating data sets using Scikit model learning.
"""

'''
Build data set for Scikit learning
'''


def build_data_set(input_data_set):
    # pending debugging in estimator_model
    return input_data_set


if __name__ == "__main__":

    # TODO convert to pulling data from database once ready
    df = pd.read_csv('test_files/dfog.csv')  # to be removed when the above is fixed
    df.drop(columns='Unnamed: 0', inplace=True)

    # using ratings as the level of success, and removing other success metrics
    likes_target = df.pop("likes")
    photo_target = df.pop("photo_count")

    train_set, test_set = train_test_split(df, test_size=.2)
    train_set, val_set = train_test_split(train_set, test_size=.5)

    # using ratings as the label for success
    train_labels = train_set.pop("ratings")
    val_labels = val_set.pop("ratings")
    test_labels = test_set.pop("ratings")

    # create scaler to normalize data & normalize data set
    scaler = sk.preprocessing.StandardScaler()
    scaler.fit(train_set)

    # normalize data
    train_set = scaler.transform(train_set)
    val_set = scaler.transform(val_set)
    test_set = scaler.transform(test_set)

    # create the linear regressor
    reg = linear_model.Lasso(alpha=0.1)
    reg.fit(train_set, train_labels)

    # predict & check
    predictions = reg.predict(val_set)
    throwaway, val_check = zip(*val_labels.items())

    count = 0
    for pred in predictions:
        print("Prediction is:  {}  vs. the actual of  {} ".format(pred, val_check[count]))
        count += 1
