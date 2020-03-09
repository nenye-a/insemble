from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf
import insemble_data_tools
import pandas as pd
import sklearn as sk
from sklearn.model_selection import train_test_split
import re

from tensorflow import keras

"""
Files that uses tensor estimators to estimate performance!
"""


def make_input_fn(data_df, label_df, num_epochs=10, shuffle=True, batch_size=200):
    def input_function():
        ds = tf.data.Dataset.from_tensor_slices((dict(data_df), label_df))
        if shuffle:
            ds = ds.shuffle(1000)
        ds = ds.batch(batch_size).repeat(num_epochs)
        return ds

    return input_function


if __name__ == "__main__":

    df, ids, cc = insemble_data_tools.build_data_set(1000, price=True)

    insemble_data_tools.save_data_set("te-1", ids)

    # using likes as the metric
    photo_target = df.pop("photo_count")

    print(df.describe().transpose())
    df.describe().transpose().to_csv('leStats.csv')

    train_set, test_set = train_test_split(df, test_size=.1)
    train_set, val_set = train_test_split(train_set, test_size=.5)

    # using ratings as the label for success
    train_labels = train_set.pop("likes")
    val_labels = val_set.pop("likes")
    test_labels = test_set.pop("likes")

    # build the estimator feature columns
    df_numerical = []
    for columnName in train_set.columns.values:
        df_numerical.append(columnName)
    feature_columns = []
    for feature_name in df_numerical:
        feature_columns.append(tf.feature_column.numeric_column(feature_name, dtype=tf.float32))

    # FIXME: Find a good way to normalize without relying on scikit-learn
    # create scaler to normalize data & normalize data set
    scaler = sk.preprocessing.StandardScaler()
    scaler.fit(train_set)

    # normalize data
    train_set = pd.DataFrame(scaler.transform(train_set))
    val_set = pd.DataFrame(scaler.transform(val_set))
    test_set = pd.DataFrame(scaler.transform(test_set))

    train_set.columns = df_numerical
    val_set.columns = df_numerical
    test_set.columns = df_numerical

    train_input_fn = make_input_fn(train_set, train_labels)
    eval_input_fn = make_input_fn(val_set, val_labels, num_epochs=1, shuffle=False)
    test_input_fun = make_input_fn(test_set, test_labels, num_epochs=1, shuffle=False)

    # metric function for linear regressor
    def my_mae(labels, predictions):
        mae_metric = tf.keras.metrics.MeanAbsoluteError()
        mae_metric.update_state(y_true=labels, y_pred=predictions['predictions'])
        return {'mae': mae_metric}

    # build & leverage use of a pre-build Linear Regressor leveraging Tensorflow
    linear_est = tf.estimator.LinearRegressor(feature_columns=feature_columns)
    linear_est = tf.estimator.add_metrics(linear_est, my_mae)
    linear_est.train(train_input_fn)

    result = linear_est.evaluate(eval_input_fn)
    print("Evaluation performance: {}".format(result))

    throwaway, final_label = zip(*test_labels.items())
    final = list(linear_est.predict(test_input_fun))[0]['predictions'][0]

    print("Random Prediction: Predicted: {} | Actual: {}".format(final, final_label))
