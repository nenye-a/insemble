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
from new_data_parser import df
import random


def zero_col_remover(df):
    cols = list(df)
    cols_to_remove = []
    for col in cols:
        if (df[col] == 0).all():
            cols_to_remove.append(col)
    df = df.drop(columns=cols_to_remove)
    return df


df = zero_col_remover(df)  # dataframe with no zero columnns
df = df.sample(frac=1)  # IF SHUFFLE IS DESIRED
# print(df.head())

''' CLUSTERING:
----------------------------------------------------------------------------------------------------------- '''


def columns_for_clustering(df):
    ''' Taking all categories as a one hot vector, and median household income. Price needs to be added '''
    result = []
    col_names = []
    inx = 0
    for col in df.columns:
        if col == 'juice_bar':
            result.append(inx)
            col_names.append(col)
            break
        result.append(inx)
        col_names.append(col)
        inx += 1
    result.append(976)  # add median household income
    col_names.append('MedHouseholdIncome3')
    return result, col_names


columns_to_cluster, cols_to_cluster_names = columns_for_clustering(df)
df_to_cluster = df.iloc[:, columns_to_cluster]
# print(df_to_cluster.head())

x = df_to_cluster.values
min_max_scaler = MinMaxScaler()
df_normalized = pd.DataFrame(min_max_scaler.fit_transform(x))
# print(df_normalized)


def wcss_check(df):
    '''check Within Cluster Sum of Squares (WCSS) '''
    wcss = []
    for i in range(1, 20):
        kmeans = KMeans(n_clusters=i, init='k-means++', max_iter=300, n_init=10, random_state=0)
        kmeans.fit(df)
        wcss.append(kmeans.inertia_)
    plt.plot(range(1, 20), wcss)
    plt.title('Elbow Method')
    plt.xlabel('Number of clusters')
    plt.ylabel('WCSS')
    plt.show()


def kmeans_clustering(df, k):
    km = KMeans(n_clusters=k).fit(df)
    cluster_map = pd.DataFrame()
    cluster_map['data_index'] = df.index.values
    cluster_map['cluster'] = km.labels_
    # check clusters
    cluster_mapper = {}
    for i in range(k):
        cluster_mapper[i] = cluster_map[cluster_map.cluster == i]
    return cluster_mapper, cluster_map


def biggest_cluster(mapper):
    biggest_cluster_length = max([len(mapper[i]) for i in mapper])
    biggest_cluster = 0
    for i in mapper:
        if len(mapper[i]) == biggest_cluster_length:
            biggest_cluster = i
            break
    return biggest_cluster


def pick_cluster(mapper, cluster):
    rows_to_consider = []
    features = mapper[mapper.cluster == cluster]
    for inx, row in features.iterrows():
        rows_to_consider.append(inx)
    return rows_to_consider


# wcss_check(df_normalized) # CHECK BEST K
mapper, km = kmeans_clustering(df_to_cluster, 10)
big_cluster = biggest_cluster(mapper)
rows_to_work = pick_cluster(km, big_cluster)
# print(len(rows_to_work))


''' DESIGNING THE NETWORK:
----------------------------------------------------------------------------------------------------------- '''


def MLP(num_units, learning_rate, num_epochs, batch_sz, dim, trainX, trainY, testX, testY):
    print("RUNNING MLP...")
    model = Sequential()
    model.add(Dense(num_units, activation="relu", input_dim=dim, kernel_initializer='normal'))
    model.add(Dense(50, activation="relu"))
    model.add(Dense(10, activation="relu"))
    model.add(Dense(10, activation="relu"))
    model.add(Dense(30, activation="relu"))
    # model.add(Dropout(0.4))
    model.add(Dense(100, activation="relu"))
    model.add(Dense(1, activation="linear"))
    # es = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=750)
    # decay_rate = learning_rate / num_epochs
    # adam = Adam(lr=learning_rate, decay=decay_rate)
    model.compile(loss='mse', optimizer='adam')
    model.summary()
    history = model.fit(trainX, trainY, epochs=num_epochs, batch_size=batch_sz, shuffle=True, validation_split=0.2, verbose=1)
    print('STARTING EVALUATION')
    scores = model.evaluate(testX, testY)
    print("SCORES:", scores)
    model.save("new_model3.h5")
    return (model, scores, history)
    # return model, history


''' NETWORK UTILITY FUNCTIONS:
----------------------------------------------------------------------------------------------------------- '''


def model_loader(testX, testY, model_name):
    model = load_model(model_name)
    # summarize model.
    model.summary()
    # evaluate the model
    scores = model.evaluate(testX, testY, verbose=1)
    print(scores[1])
    return model


def predictor(x, y, model, cnn=False):
    if cnn:
        x = x.reshape(x.shape[0], x.shape[1], 1)
    # make a prediction
    pred = model.predict(x)
    # print(pred, x, y)
    # show the inputs and predicted outputs
    for i in range(len(x)):
        print("y=%s, Predicted=%s" % (y[i], pred[i]))


''' CREATING TRAINING AND TESTING:
----------------------------------------------------------------------------------------------------------- '''


def output_creator(df):
    ''' returns the product of google ratings * number of ratings '''
    outputs = []
    for inx, row in df.iterrows():
        score = row['num_google_ratings'] * row['google_star_rating']
        outputs.append(score)
    output_df = pd.DataFrame()
    output_df['Google_Score'] = outputs
    return output_df


cols_to_cluster_names.remove('MedHouseholdIncome3')  # we want median house income in the deep learning training
cols_to_cluster_names.extend(['num_google_ratings', 'google_star_rating'])  # we dont want the output in the input. Haha.
features = df.drop(columns=cols_to_cluster_names)
features = features.iloc[rows_to_work, :]  # IF WE PICK A CLUSTER
random_columns = [random.randint(1, 445) for x in range(20)]  # PICK RANDOM FEATURES!!!
# print(random_columns)
features = features.iloc[:, random_columns]
# print(features.head(), len(features))
features = features.values
# features = min_max_scaler.fit_transform(features) # IF NORMALIZATION IS DESIRED
targets = output_creator(df)
targets = targets.iloc[rows_to_work, :]  # IF WE PICK A CLUSTER

dim = len(features[1, :])  # number of features
# print(dim)
n = len(features)  # number of stores
divider = 2 * n // 3  # two thirds of the data to training, one third for testing
trainX = features[: divider]
trainY = targets[: divider]
testX = features[divider:]
testY = targets[divider:]
trainX, trainY, testX, testY = np.array(trainX), np.array(trainY), np.array(testX), np.array(testY)
# print(len(trainX), len(trainY), len(testX), len(testY))

''' RUNNING MODELS:
----------------------------------------------------------------------------------------------------------- '''

Model, evaluation, history = MLP(250, 0.1, 1000, 35, dim, trainX, trainY, testX, testY)
print("DONE")
# Model, evaluation, history = CNN_1D(10, 0.1, 300, 20, dim, trainX, trainY, testX, testY)
# Model = model_loader(testX, testY)
predictor(testX[:100], testY[:100], Model, cnn=False)


''' PLOTS:
----------------------------------------------------------------------------------------------------------- '''

# "Loss"
plt.plot(history.history["loss"])
plt.plot(history.history["val_loss"])
plt.title("model loss")
plt.ylabel("loss")
plt.xlabel("epoch")
plt.legend(["train", "val"], loc="upper left")
plt.show()
