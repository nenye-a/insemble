from __future__ import absolute_import, division, print_function, unicode_literals
import pickle
import numpy as np
import pandas as pd
import math
import statistics
import re
import insemble_data_tools
import sklearn as sk
from sklearn.model_selection import train_test_split
from sklearn import linear_model

if __name__ == "__main__":

    #df, ids, cc = db_model_commune.build_data_set(2200, price=True)
    df, ids, cc = insemble_data_tools.get_data_set("sk-3")

    #db_model_commune.save_data_set("sk-3", ids)

    # using likes as the metric
    photo_target = df.pop("photo_count")

    print(df.describe().transpose())
    df.describe().transpose().to_csv('leStats.csv')

    train_set, test_set = train_test_split(df, test_size=.2)
    train_set, val_set = train_test_split(train_set, test_size=.5)

    # using ratings as the label for success
    train_labels = train_set.pop("likes")
    val_labels = val_set.pop("likes")
    test_labels = test_set.pop("likes")

    # create scaler to normalize data & normalize data set
    scaler = sk.preprocessing.StandardScaler()
    scaler.fit(train_set)

    # # normalize data
    # train_set = scaler.transform(train_set)
    # val_set = scaler.transform(val_set)
    # test_set = scaler.transform(test_set)

    # create the regressor
    reg = linear_model.Ridge(alpha=0.5)
    reg.fit(train_set, train_labels)

    # predict & check
    predictions = reg.predict(val_set)
    throwaway, val_check = zip(*val_labels.items())

    metrics = []

    count = 0
    errors = []

    for pred in predictions:

        error = float(pred) - float(val_check[count])
        errors.append(error)

        print("Prediction is:  {}  vs. the actual of  {} ".format(pred, val_check[count]))
        count += 1

    mae = statistics.mean(errors)
    mse = math.sqrt(statistics.mean([math.pow(error, 2) for error in errors]))
    maeStd = statistics.stdev(errors)

    print("Mean Square Error: {}".format(mse))
    print("Mean Absolute Error: {}".format(mae))
    print("Std of Error: {}".format(maeStd))
