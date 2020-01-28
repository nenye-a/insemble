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

'---------------------------------------------------------------------'

def data_gen(inputs):
    '''
    select the data based on a predefined criterion
    returns a pandas feature set
    '''
    relevant_cols = []
    inputs = inputs.iloc[:, 39:]
    counter = 39
    for i in inputs.columns:
        if 'nearby' in i:
            counter += 1
            continue
        relevant_cols.append(counter)
        counter += 1
    return relevant_cols

def mean_squared_error(y_true, y_pred):
    return K.mean(K.square(y_pred - y_true), axis=-1)

def MLP(num_units, learning_rate, num_epochs, batch_sz, dim, trainX, trainY, testX, testY):
    print("RUNNING MLP...")
    model = Sequential()
    model.add(Dense(num_units, activation="relu", input_dim=dim, kernel_initializer='normal'))
    model.add(Dense(100, activation="relu"))
    # model.add(Dense(100, activation="relu"))
    # model.add(Dense(1000, activation="relu"))
    # model.add(Dense(300, activation="relu"))
    # model.add(Dropout(0.2))
    model.add(Dense(500, activation="relu"))
    model.add(Dense(1, activation="linear"))
    es = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=750)
    decay_rate = learning_rate / num_epochs
    adam = Adam(lr=learning_rate, decay=decay_rate)
    model.compile(loss='mse', optimizer=adam, metrics=[mean_squared_error])
    model.summary()
    history = model.fit(trainX, trainY, epochs=num_epochs, batch_size=batch_sz, shuffle=True, validation_split=0.1, verbose=1, callbacks=[es])
    print('STARTING EVALUATION')
    scores = model.evaluate(testX, testY)
    print("SCORES:", scores)
    model.save("new_model3.h5")
    return (model, scores[1], history)
    # return model, history


def CNN_1D(num_units, learning_rate, num_epochs, batch_sz, dim, trainX, trainY, testX, testY):
    trainX, testX = trainX.reshape(trainX.shape[0], trainX.shape[1], 1), testX.reshape(testX.shape[0], testX.shape[1], 1)
    # trainY, testY = trainY.reshape(trainX.shape[0], 1, trainX.shape[1]), testY.reshape(testX.shape[0], 1, testX.shape[1])
    print("RUNNING 1D CNN...")
    model = Sequential()
    model.add(Conv1D(filters=32, kernel_size=2, activation='relu', input_shape=(trainX.shape[1], 1)))
    # model.add(Conv1D(filters=32, kernel_size=2, activation='relu'))
    # model.add(MaxPooling1D(pool_size=1))
    model.add(Conv1D(filters=16, kernel_size=2, activation='relu'))
    model.add(MaxPooling1D(pool_size=1))
    model.add(Flatten())
    model.add(Dense(20, activation='relu'))
    model.add(Dense(1, activation="linear"))
    decay_rate = learning_rate / num_epochs
    adam = Adam(lr=learning_rate, decay=decay_rate)
    model.compile(loss='mse', optimizer=adam, metrics=[mean_squared_error])
    es = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=175)
    # chk = ModelCheckpoint("DELETED_BASE64_STRING_model.hdf5", monitor='val_acc', save_best_only=True, mode='max', save_weights_only=False, verbose=1)
    model.summary()
    # plot_model(model, "DELETED_BASE64_STRING_LSTM.png")
    history = model.fit(trainX, trainY, epochs=num_epochs, batch_size=batch_sz, shuffle=True, validation_split=0.1, verbose=1, callbacks=[es])
    print('STARTING EVALUATION')
    # model.load_weights('/home/ubuntu/environment/RiskRadar/best_model.hdf5')
    # evaluate
    scores = model.evaluate(testX, testY)
    print("SCORES:", scores)
    return (model, scores[1], history)

def load_modelo(testX, testY):
    model = load_model('new_model.h5')
    # summarize model.
    model.summary()
    # evaluate the model
    scores = model.evaluate(testX, testY, verbose=1)
    print(scores[1])
    return model

def Kmeans(num_of_clusters, features):
    km = KMeans(n_clusters=num_of_clusters).fit(features)
    cluster_map = pd.DataFrame()
    cluster_map['data_index'] = features.index.values
    cluster_map['cluster'] = km.labels_
    return cluster_map

def prediction(x, y, model, cnn=False):
    if cnn:
        x = x.reshape(x.shape[0], x.shape[1], 1)
    # make a prediction
    pred = model.predict(x)
    # print(pred, x, y)
    # show the inputs and predicted outputs
    for i in range(len(x)):
        print("y=%s, Predicted=%s" % (y[i], pred[i]))

'---------------------------------------------------------------------'

inputs, d, d = idt.get_data_set("test_data", ratings=False, price=True, classification=True, class_number=2)
# inputs.to_csv("DELETED_BASE64_STRING_insights_testing/input_data_no_ratings.csv")
# print(inputs.head())

inputs = inputs.sample(frac=1)

cols_to_consider = [0, 1, 2, 3, 4, 5, 6, 7, 36, 38] + data_gen(inputs)
cols_to_cluster = [7, 34] + data_gen(inputs)
features = inputs.iloc[:, cols_to_cluster]


x = features.values
min_max_scaler = MinMaxScaler()
std_features = min_max_scaler.fit_transform(x)
features = pd.DataFrame(std_features)
# print(std_inputs)

k = 10
cluster_map = Kmeans(k, features)
# check clusters
cluster_mapper = {}
for i in range(k):
    cluster_mapper[i] = cluster_map[cluster_map.cluster == i]
print(cluster_mapper)

biggest_cluster_length = max([len(cluster_mapper[i]) for i in cluster_mapper])
biggest_cluster = 0
for i in cluster_mapper:
    if len(cluster_mapper[i]) == biggest_cluster_length:
        biggest_cluster = i
        break

# check Within Cluster Sum of Squares (WCSS)
# wcss = []
# for i in range(1, 11):
#     kmeans = KMeans(n_clusters=i, init='k-means++', max_iter=300, n_init=10, random_state=0)
#     kmeans.fit(features)
#     wcss.append(kmeans.inertia_)
# plt.plot(range(1, 11), wcss)
# plt.title('Elbow Method')
# plt.xlabel('Number of clusters')
# plt.ylabel('WCSS')
# plt.show()


rows_to_consider = []
features = cluster_map[cluster_map.cluster == biggest_cluster]
for inx, row in features.iterrows():
    rows_to_consider.append(inx)

# # print("ROWS", rows_to_consider, len(rows_to_consider))
# # print("COLUMNS", cols_to_consider, len(cols_to_consider))
# features = inputs.iloc[:, cols_to_consider]
features = inputs.iloc[rows_to_consider, cols_to_consider]
features = features.values
features = min_max_scaler.fit_transform(features)
# target_vals = inputs.iloc[:, [37]]
target_vals = inputs.iloc[rows_to_consider, [37]]
# print(features.isna().sum(), target_vals.isna().sum())

'---------------------------------------------------------------------'


dim = len(features[1, :])
# print(dim)
n = len(features)
divider = 2 * n // 3
# print("FEATURES", features)
# print("TARGET", target_vals)
trainX = features[: divider]
trainY = target_vals[: divider]
testX = features[divider:]
testY = target_vals[divider:]
# print(len(testY), len(testX))
trainX, trainY, testX, testY = np.array(trainX), np.array(trainY), np.array(testX), np.array(testY)
# print(len(trainX), len(trainY), len(testX), len(testY))

'---------------------------------------------------------------------'
#
# Model, evaluation, history = MLP(250, 0.1, 300, 20, dim, trainX, trainY, testX, testY)
Model, evaluation, history = CNN_1D(10, 0.1, 300, 20, dim, trainX, trainY, testX, testY)
# Model = load_modelo(testX, testY)
prediction(testX[:100], testY[:100], Model, cnn=True)
# # print(history.history.keys())
# #
'---------------------------------------------------------------------'

# "Loss"
plt.plot(history.history["loss"])
plt.plot(history.history["val_loss"])
plt.title("model loss")
plt.ylabel("loss")
plt.xlabel("epoch")
plt.legend(["train", "val"], loc="upper left")
plt.show()
#

