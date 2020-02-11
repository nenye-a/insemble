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
from mongo_connect import Connect


client = Connect.get_connection()
db = client.spaceData
collections = db.spaces
print("Total records for the collection" + ' ' + str(collections.count()))
results = collections.find()
df = pd.DataFrame(list(results))
print(df)
df.to_csv("Mega_DataFrame.csv")
df = pd.read_csv("Mega_DataFrame.csv")
print(df.head())


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


