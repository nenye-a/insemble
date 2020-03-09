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

# Gradient boosting algorithm test


def test_predictions():
    # get data
    all_data, d, d = idt.get_data_set("test_data", ratings=True, price=True)
#    all_data, ids, d = idt.build_data_set(10000, price=True)
#    print(idt.save_data_set("test_data_photos_no_ratings", ids))

    print(list(all_data))

    # filter out columns that we don't want
    all_data = all_data[all_data["price"] != -1]

    # only take data for restaurants
    all_data = all_data[all_data["Bar"] == 1]

    #all_data = all_data[["pop", "income", "likes", "age"]]

    # get a sample of the data
    sample = all_data.sample(frac=1)

    # get train, test sets
    train, test = train_test_split(sample, test_size=0.1)
    train, val = train_test_split(train, test_size=0.1)
    print("Length of train set: {}".format(len(train)))
    print("Length of val set: {}".format(len(val)))
    print("Length of test set: {}".format(len(test)))

    train_x, train_y_1 = idt.generate_label_series(train, "likes")
    val_x, val_y_1 = idt.generate_label_series(val, "likes")
    test_x, test_y_1 = idt.generate_label_series(test, "likes")

    train_x, train_y_2 = idt.generate_label_series(train, "age")
    val_x, val_y_2 = idt.generate_label_series(val, "age")
    test_x, test_y_2 = idt.generate_label_series(test, "age")

    train_y = train_y_1.div(train_y_2)
    val_y = val_y_1.div(val_y_2)
    test_y = test_y_1.div(test_y_2)

    print(test_x)
    print(test_y)

    # balance ratings -- check this again
    # train_x, train_y = idt.balance_ratings_set(train_x, train_y)

    # scaling x
    #scaler_x = MinMaxScaler().fit(train_x)
    #scaled_train_x = scaler_x.transform(train_x)
    #scaled_test_x = scaler_x.transform(test_x)

    # scaling y
    #scaler_y = MinMaxScaler().fit(np.array(train_y).reshape(-1, 1))
    #scaled_train_y = scaler_y.transform(np.array(train_y).reshape(-1, 1))
    #scaler_y = MinMaxScaler().fit(np.array(val_y).reshape(-1, 1))
    #scaled_val_y = scaler_y.transform(np.array(val_y).reshape(-1, 1))

    # ridge regression
    # reg_rating = linear_model.Ridge(alpha=12)

    # SVR regression
    # reg_rating = svm.SVR(gamma='scale', C= 1.2, )
    # Train & Fit (not xgb)
    # reg_rating.fit(scaled_train_rating_x, scaled_train_rating_y)
    # predict & check
    #likes_p = reg.predict(test_x)

    # XGB regression
    #param = {'max_depth': 4, 'eta': 1, 'objective': 'reg:linear', 'lambda': 2, 'verbosity': 2}
    #num_round = 500
    #dtrain = xgb.DMatrix(train_x, label=train_y)
    #dval = xgb.DMatrix(val_x, label=scaled_val_y)
    #reg = xgb.train(param, dtrain, num_round, evals=[(dval, "val set"), (dtrain, 'train set')])
    #reg = xgb.train(param, dtrain, num_round)
    reg = xgb.XGBRegressor(learning_rate=0.03, max_depth=5, n_estimators=1000, verbosity=3)
    reg.fit(train_x, train_y, eval_set=[(val_x, val_y), (test_x, test_y)])
    preds = reg.predict(test_x)
    #preds = scaler_y.inverse_transform(np.array(preds).reshape(-1,1)).reshape(1,-1)[0]

    t, actuals = zip(*test_y.items())

    #errors = []
    #accurate_count = 0
    #accuracy_percentage = .05
    for i in range(len(preds)):
        print("Pred: {}, Actual: {}".format(preds[i], actuals[i]))
    #    error = math.fabs(float(preds[i]) - float(actuals[i]))
    #    errors.append(error)
    #    if error / actuals[i] < accuracy_percentage:
    #        accurate_count += 1
    #accuracy = accurate_count / len(actuals)

    rmse = np.sqrt(metrics.mean_squared_error(test_y, preds))
    print("RMSE: %f" % (rmse))

    #mae_rating = statistics.mean(rating_errors)
    #maeStd_rating = statistics.stdev(rating_errors)
    #mse_rating = math.sqrt(statistics.mean([math.pow(error, 2) for error in rating_errors]))

    #print("\ntrain n = {}, test n = {}".format(len(train_x), len(test_x)))
    #print("Accuracy (within {}%) is {}%".format(accuracy_percentage*100, round(accuracy*100, 2)))
    #print("Ratings -  MAE: {}  ;  stdMAE: {}  ;  MSE: {}\n".format(mae_rating, maeStd_rating, mse_rating))


def iterative_accuracy_test():

    all_data, d, d = idt.get_data_set("test_data4", ratings=True)
    train, test = train_test_split(all_data, test_size=.2)

    test_rating_x, test_rating_y = idt.generate_label_series(test, "ratings")
    test_photocount_x, test_photocount_y = idt.generate_label_series(test, "photo_count")
    test_likes_x, test_likes_y = idt.generate_label_series(test, "likes")

    train_length = [x * 10 for x in range(1, int(len(train) / 10))]

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
