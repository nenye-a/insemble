import pickle
import pandas as pd
import seaborn as sns
import matplotlib
import matplotlib.pyplot as plt

if __name__ == "__main__":

    with open('iterative_test_data_realistic.pickle', 'rb') as f:
        [train_length,
         (rating_mae, rating_mae_std, rating_mse),
         (photo_mae, photo_mae_std, photo_mse),
         (likes_mae, likes_mae_std, likes_mse)
         ] = pickle.load(f)

    rating_error_df = pd.DataFrame({"train length": train_length + train_length + train_length,
                                    "rating error": rating_mae + rating_mse + rating_mae_std,
                                    "type": ["mae" for x in rating_mae] + ["mse" for x in rating_mse] + ["mat_std" for x in rating_mae_std]})

    photo_error_df = pd.DataFrame({"train length": train_length + train_length + train_length,
                                   "photo error": photo_mae + photo_mse + photo_mae_std,
                                   "type": ["mae" for x in photo_mae] + ["mse" for x in photo_mse] + ["mat_std" for x in photo_mae_std]})

    likes_error_df = pd.DataFrame({"train length": train_length + train_length + train_length,
                                   "likes error": likes_mae + likes_mse + likes_mae_std,
                                   "type": ["mae" for x in likes_mae] + ["mse" for x in likes_mse] + ["mat_std" for x in likes_mae_std]})

    plt.figure(1)
    rating_g = sns.lineplot(x="train length", y="rating error", hue="type", data=rating_error_df)

    plt.figure(2)
    photo_g = sns.lineplot(x="train length", y="photo error", hue="type", data=photo_error_df)

    plt.figure(3)
    likes_g = sns.lineplot(x="train length", y="likes error", hue="type", data=likes_error_df)

    plt.show()
