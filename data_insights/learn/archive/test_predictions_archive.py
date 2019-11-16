import insemble_data_tools as idt
import seaborn as sns
import sklearn as sk
from sklearn import linear_model
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn import svm
import numpy as np
import math
import statistics
import xgboost as xgb


def test_predictions():
    all_data, d, d = idt.get_data_set("test_data", ratings=True, price=True)
    # all_data, ids, d = idt.build_data_set(10000, price=True)
    # print(idt.save_data_set("test_data_photos_no_ratings", ids))

    all_data = all_data[all_data["price"] != -1]

    train, test = train_test_split(all_data, test_size=.1)

    print("Length of Large train set: {}".format(len(train)))

    train_rating_x, train_rating_y = idt.generate_label_series(train, "ratings")
    train_photo_x, train_photo_y = idt.generate_label_series(train, "photo_count")
    train_likes_x, train_likes_y = idt.generate_label_series(train, "likes")

    test_rating_x, test_rating_y = idt.generate_label_series(test, "ratings")
    test_photo_x, test_photo_y = idt.generate_label_series(test, "photo_count")
    test_likes_x, test_likes_y = idt.generate_label_series(test, "likes")

    # normalize the data
    scaler_rating = MinMaxScaler().fit(train_rating_x)
    scaler_photo = MinMaxScaler().fit(train_photo_x)
    scaler_likes = MinMaxScaler().fit(train_likes_x)

    # scaler for y input for XGB
    scaler_rating_y = MinMaxScaler().fit(np.array(train_rating_y).reshape(-1, 1))
    scaler_photo_y = MinMaxScaler().fit(np.array(train_photo_y).reshape(-1, 1))
    scaler_likes_y = MinMaxScaler().fit(np.array(train_likes_y).reshape(-1, 1))

    scaled_train_rating_x = scaler_rating.transform(train_rating_x)
    scaled_train_likes_x = scaler_likes.transform(train_likes_x)
    scaled_train_photo_x = scaler_photo.transform(train_photo_x)
    scaled_test_rating_x = scaler_rating.transform(test_rating_x)
    scaled_test_likes_x = scaler_likes.transform(test_likes_x)
    scaled_test_photo_x = scaler_photo.transform(test_photo_x)

    # normalized y vectors just for xgb

    scaled_train_rating_y = scaler_rating_y.transform(np.array(train_rating_y).reshape(-1, 1))
    scaled_train_likes_y = scaler_likes_y.transform(np.array(train_likes_y).reshape(-1, 1))
    scaled_train_photo_y = scaler_photo_y.transform(np.array(train_photo_y).reshape(-1, 1))
    scaled_test_rating_y = scaler_rating_y.transform(np.array(test_rating_y).reshape(-1, 1))
    scaled_test_likes_y = scaler_likes_y.transform(np.array(test_likes_y).reshape(-1, 1))
    scaled_test_photo_y = scaler_photo_y.transform(np.array(test_photo_y).reshape(-1, 1))


    # ridge regression

    # reg_rating = linear_model.Ridge(alpha=12)
    # reg_photo = linear_model.Ridge(alpha=12)
    # reg_likes = linear_model.Ridge(alpha=12)

    # SVR regression
    # reg_rating = svm.SVR()
    # reg_photo = svm.SVR()
    # reg_likes = svm.SVR()

    # XGB resgression

    param = {'max_depth': 4, 'eta': 1, 'objective': 'binary:logistic', 'lambda':2, 'verbosity':2,  }
    num_round = 2
    reg_rating = xgb.train(param, xgb.DMatrix(scaled_train_rating_x, label=scaled_train_rating_y), num_round)
    reg_photo = xgb.train(param, xgb.DMatrix(scaled_train_photo_x, label=scaled_train_photo_y), num_round)
    reg_likes = xgb.train(param, xgb.DMatrix(scaled_train_likes_x, label=scaled_train_likes_y), num_round)

    # Train & Fit
    # reg_rating.fit(scaled_train_rating_x, train_rating_y)
    # reg_photo.fit(scaled_train_photo_x, train_photo_y)
    # reg_likes.fit(scaled_train_likes_x, train_likes_y)

    # with open('trained_rating_estimator_sk.pickle', 'wb') as f:

    # predict & check
    # rating_p = reg_rating.predict(scaled_test_rating_x)
    # photo_p = reg_photo.predict(scaled_test_photo_x)
    # likes_p = reg_likes.predict(scaled_test_likes_x)

    # xgb predict & check
    rating_p = reg_rating.predict(xgb.DMatrix(scaled_test_rating_x))
    photo_p = reg_photo.predict(xgb.DMatrix(scaled_test_photo_x))
    likes_p = reg_likes.predict(xgb.DMatrix(scaled_test_likes_x))

    rating_p = scaler_rating_y.inverse_transform(np.array(rating_p).reshape(-1,1)).reshape(1,-1)[0]
    photo_p = scaler_photo_y.inverse_transform(np.array(photo_p).reshape(-1,1)).reshape(1,-1)[0]
    likes_p = scaler_likes_y.inverse_transform(np.array(likes_p).reshape(-1,1)).reshape(1,-1)[0]

    t, rating = zip(*test_rating_y.items())
    t, photo = zip(*test_photo_y.items())
    t, likes = zip(*test_likes_y.items())


    likes_errors = []
    photo_errors = []
    rating_errors = []

    accuracy = []

    # count = 0

    for i in range(len(likes_p)):
        likes_errors.append(math.fabs(float(likes_p[i]) - float(likes[i])))
        photo_errors.append(math.fabs(float(photo_p[i]) - float(photo[i])))
        rating_errors.append(math.fabs(float(rating_p[i]) - float(rating[i])))


    mae_likes = statistics.mean(likes_errors)
    maeStd_likes = statistics.stdev(likes_errors)
    mse_likes = math.sqrt(statistics.mean([math.pow(error, 2) for error in likes_errors]))

    mae_photo = statistics.mean(photo_errors)
    maeStd_photo = statistics.stdev(photo_errors)
    mse_photo = math.sqrt(statistics.mean([math.pow(error, 2) for error in photo_errors]))

    mae_rating = statistics.mean(rating_errors)
    maeStd_rating = statistics.stdev(rating_errors)
    mse_rating = math.sqrt(statistics.mean([math.pow(error, 2) for error in rating_errors]))

    print("\ntrain n = {}, test n = {}\n".format(len(train), len(test)))
    print("Ratings -  MAE: {}  ;  stdMAE: {}  ;  MSE: {}\n".format(mae_rating, maeStd_rating, mse_rating))



def iterative_accuracy_test():

    all_data, d, d = idt.get_data_set("test_data4", ratings=True)
    train, test = train_test_split(all_data, test_size=.2)

    test_rating_x, test_rating_y = idt.generate_label_series(test, "ratings")
    test_photocount_x, test_photocount_y = idt.generate_label_series(test, "photo_count")
    test_likes_x, test_likes_y = idt.generate_label_series(test, "likes")

    train_length = [x*10 for x in range(1, int(len(train)/10))]

    rating_mse, rating_mae, rating_mae_std = [], [], []
    photo_mse, photo_mae, photo_mae_std = [], [], []
    likes_mse, likes_mae, likes_mae_std = [], [], []

    for i, length in enumerate(train_length):
        train_x = train.head(length)

        reg_rating = linear_model.Ridge(alpha=0.5)
        reg_photo = linear_model.Ridge(alpha=0.5)
        reg_likes = linear_model.Ridge(alpha=0.5)

        train_rating_x, train_rating_y = idt.generate_label_series(train_x, "ratings")
        train_photocount_x, train_photocount_y = idt.generate_label_series(train_x, "photo_count")
        train_likes_x, train_likes_y = idt.generate_label_series(train_x, "likes")

        reg_rating.fit(train_rating_x, train_rating_y)
        reg_photo.fit(train_photocount_x, train_photocount_y)
        reg_likes.fit(train_likes_x, train_likes_y)

        rating_p = reg_rating.predict(test_rating_x)
        photo_p = reg_photo.predict(test_photocount_x)
        likes_p = reg_likes.predict(test_likes_x)

        t, rating = zip(*test_rating_y.items())
        t, photo = zip(*test_photocount_y.items())
        t, likes = zip(*test_likes_y.items())

        likes_errors = []
        photo_errors = []
        rating_errors = []

        for j in range(len(likes_p)):
            likes_errors.append(math.fabs(float(likes_p[j]) - float(likes[j])))
            photo_errors.append(math.fabs(float(photo_p[j]) - float(photo[j])))
            rating_errors.append(math.fabs(float(rating_p[j]) - float(rating[j])))

        likes_mae.append(statistics.mean(likes_errors))
        likes_mae_std.append(statistics.stdev(likes_errors))
        likes_mse.append(math.sqrt(statistics.mean([math.pow(error, 2) for error in likes_errors])))

        photo_mae.append(statistics.mean(photo_errors))
        photo_mae_std.append(statistics.stdev(photo_errors))
        photo_mse.append(math.sqrt(statistics.mean([math.pow(error, 2) for error in photo_errors])))

        rating_mae.append(statistics.mean(rating_errors))
        rating_mae_std.append(statistics.stdev(rating_errors))
        rating_mse.append(math.sqrt(statistics.mean([math.pow(error, 2) for error in rating_errors])))

        if i % 5 == 0:
            print(".", end="")
        if i % 20 == 0:
            print("\nAnother {} left to go!".format(len(train_length) - i))

    return [train_length,
            (rating_mae, rating_mae_std, rating_mse),
            (photo_mae, photo_mae_std, photo_mse),
            (likes_mae, likes_mae_std, likes_mse)
            ]

if __name__ == "__main__":

    # K = iterative_accuracy_test()
    #
    # with open('iterative_test_data_realistic.pickle', 'wb') as f:
    #     pickle.dump(K, f)

    test_predictions()