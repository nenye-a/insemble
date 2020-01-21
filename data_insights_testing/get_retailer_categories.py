from __future__ import absolute_import, division, print_function, unicode_literals
import pickle
import numpy as np
import pandas as pd
import math, statistics
import re
import insemble_data_tools
import sklearn as sk
from sklearn.model_selection import train_test_split
from sklearn import linear_model

if __name__ == "__main__":

    #df, ids, cc = db_model_commune.build_data_set(2200, price=True)
    df, ids, cc = insemble_data_tools.get_data_set("sk-3")

    print(df["likes"])

#    features = list(df)
#    for i in range(len(features)-1,-1,-1):
#        if "nearby" in features[i] or "Restaurant" in features[i]:
#            del(features[i])
#    print(features)
