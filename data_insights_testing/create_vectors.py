# create vectors and store them in mongodb 

import sys
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR,'data_aggregator'))  # include data_agregator in path

import pandas as pd
from utils import DB_VECTORS 

def create_vectors():

    df = pd.read_csv("/Users/austinhome/workplace_david/insemble/data_insights_testing/data_for_vectors.csv")

    #l = list(df)
    #for i, e in enumerate(l):
    #    print(i, e) 

    # get each feature
    #psycho = df.iloc[:, [i for i in range(868, 1012)]]
    #num_households = df.iloc[:, [1015, 1021]]
    #daytime_pop = df.iloc[:, [1012, 1018]]
    #daytime_working_pop = df.iloc[:, [1013, 1019]]
    #income = df.iloc[:, [1017, 1023]]
    #gender = df.iloc[:, [578, 579, 723, 724]]
    #race = df.iloc[:, [i for i in range(580, 604)] + [i for i in range(725, 749)]]
    #age = df.iloc[:, [i for i in range(604, 617)] + [i for i in range(749, 762)]]
    #travel_time = df.iloc[:, [678,679,680,823,824,825]]
    #transport_methods = df.iloc[:, [i for i in range(672, 678)] + [i for i in range(817, 823)]]

    # normalize each feature 
    #psycho = normalize(psycho)
    #num_households = normalize(num_households)
    #daytime_pop = normalize(daytime_pop)
    #daytime_working_pop = normalize(daytime_working_pop)
    #income = normalize(income)
    #gender = normalize(gender)
    #race = normalize(race)
    #age = normalize(age)
    #travel_time = normalize(travel_time)
    #transport_methods = normalize(transport_methods)

    df_trimmed = df.iloc[:, [1, 2] + [i for i in range(293, 365)] + [440] + [437] + [438] + [442] + [i for i in range(3, 40)] + [i for i in range(97, 106)] + [-1]]

    data = df_trimmed.to_dict(orient='records')

    DB_VECTORS.remove()
    DB_VECTORS.insert_many(data)     

# normalize df 
def normalize(df):
    return (df-df.min())/(df.max()-df.min())

if __name__ == "__main__":
    create_vectors()
