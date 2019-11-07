import insemble_data_tools as idt
import seaborn as sns
import sklearn as sk
from sklearn import linear_model
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn import svm
from sklearn import metrics
import numpy as np
import math
import statistics
import xgboost as xgb


def test_predictions():

    c_number = 3

    all_data, d, d = idt.get_data_set("test_data", ratings=True, price=True, classification=True, class_number= c_number)
    # all_data, ids, d = idt.build_data_set(10000, price=True, price=True, classification=True, class_number= 3)
    # print(idt.save_data_set("test_data_photos_no_ratings", ids))

    all_data = all_data[all_data["price"] != -1]
    all_data = all_data[all_data["ratings"] > 0]

    train, test = train_test_split(all_data, test_size=.2)

    print("Length of Large train set prior to any balancing: {}".format(len(train)))

    train_rating_x, train_rating_y = idt.generate_label_series(train, "ratings")
    test_rating_x, test_rating_y = idt.generate_label_series(test, "ratings")

    # train_rating_x, train_rating_y = idt.balance_ratings_set_classification(train_rating_x, train_rating_y,
    #                                                                         class_number=c_number)

    print(len(all_data))
    print(len(train))
    print(len(train_rating_x))


    # normalize the data
    scaler_rating = MinMaxScaler().fit(train_rating_x)

    # scaling the x train and test
    scaled_train_rating_x = scaler_rating.transform(train_rating_x)
    scaled_test_rating_x = scaler_rating.transform(test_rating_x)

    # SVC classification
    clf_rating = svm.SVC()

    # XGB classification
    # param = {'max_depth': 4, 'eta': 1, 'objective': 'binary:logistic', 'lambda': 2, 'verbosity': 2 }
    # num_round = 2
    # clf_rating = xgb.train(param, xgb.DMatrix(scaled_train_rating_x, label=scaled_train_rating_y), num_round)

    # Train & Fit (classification)
    clf_rating.fit(scaled_train_rating_x, train_rating_y)

    # predict & check
    rating_p = clf_rating.predict(scaled_test_rating_x)

    # xgb predict & check
    # rating_p = clf_rating.predict(xgb.DMatrix(scaled_test_rating_x))
    # rating_p = scaler_rating_y.inverse_transform(np.array(rating_p).reshape(-1,1)).reshape(1,-1)[0]

    t, rating = zip(*test_rating_y.items())

    # fpr, tpr, thresholds = metrics.roc_curve()
    confusion_matrix = metrics.confusion_matrix(rating, rating_p)

    # for x in range(len(rating)):
    #     print("Prediction is {} vs. Actual of {}".format(rating_p[x], rating[x]))

    print("\ntrain n = {}, test n = {}".format(len(train_rating_x), len(test_rating_x)))
    print("confusion matrix is:")
    print(confusion_matrix)

def iterative_accuracy_test():

    return

if __name__ == "__main__":

    test_predictions()