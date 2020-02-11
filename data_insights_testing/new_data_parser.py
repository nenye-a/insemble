import pandas as pd
from mongo_connect import Connect


def process_data():
    #pd.set_option('display.max_rows', None)  # or 1000


    client = Connect.get_connection()
    db = client.spaceData
    collections = db.spaces
    print("Total records for the collection" + ' ' + str(collections.count()))
    results = collections.find().limit(100)
    indf = pd.DataFrame(list(results))
    print(indf)
    #df.to_csv("Mega_DataFrame.csv")
    #df = pd.read_csv("Mega_DataFrame.csv")
    #print(df.head())

    outdf = pd.DataFrame()
    #indf = pd.read_csv("Mega_DataFrame.csv",nrows=100)


    # NEARBY POIS 
    #for i, row in indf.iterrows():
    #    lst = row.loc["nearby_store"]
    #    if type(lst) is not list:
    #        continue
    #    count = 0
    #    for place in lst:
    #        dis = place["distance"]
    #        if dis < 0.5:

    # CATEGORIES 
    # make cat set 
    catset = set()
    for cats in indf["types"]:
        for cat in cats:
            if cat not in ["establishment", "point_of_interest", "store"]:
                catset.add(cat)
    for cats in indf["foursquare_categories"]:
        if type(cats) is not list or len(cats) == 0:
            continue
        d = cats[0]
        cat = d["category_name"].lower().replace(" ", "_")
        catset.add(cat)

    # determine if each place falls into each cat
    for i, row in indf.iterrows():
        print("Making categories features", i)
        for cat in catset:
            # check foursquare cat
            cats = row.loc["foursquare_categories"]
            if type(cats) is list and len(cats) != 0:
                if cat in cats[0]["category_name"].lower().replace(" ", "_"):
                    outdf.set_value(i, cat, 1)
                    continue
            # check types cat
            if cat in row.loc["types"]:
                outdf.set_value(i, cat, 1)
                continue
            # set 0s
            outdf.set_value(i, cat, 0)

    # DEMOGRAPHICS + PSYCHOGRAPHICS  
    for i, row in indf.iterrows():
        print("Making demo and psycho features", i)
        big_dict = row.loc["demo1"]
        if type(big_dict) is dict:
            for big_key in big_dict:
                item = big_dict[big_key]
                if type(item) is dict:
                    for key in item:
                        outdf.set_value(i, key + " 1", item[key])
                else:
                    outdf.set_value(i, big_key + " 1", item)

        big_dict = row.loc["demo3"]
        if type(big_dict) is dict:
            for big_key in big_dict:
                item = big_dict[big_key]
                if type(item) is dict:
                    for key in item:
                        outdf.set_value(i, key + " 3", item[key])
                else:
                    outdf.set_value(i, big_key + " 3", item)

        big_dict = row.loc["psycho1"]
        if type(big_dict) is dict:
            for big_key in big_dict:
                item = big_dict[big_key]
                if type(item) is dict:
                    for key in item:
                        outdf.set_value(i, key + " 1", item[key])
                else:
                    outdf.set_value(i, big_key + " 1", item)

        big_dict = row.loc["psycho3"]
        if type(big_dict) is dict:
            for big_key in big_dict:
                item = big_dict[big_key]
                if type(item) is dict:
                    for key in item:
                        outdf.set_value(i, key + " 3", item[key])
                else:
                    outdf.set_value(i, big_key + " 3", item)

    # ARCGIS
    for i, row in indf.iterrows():
        print("Making arcgis features", i)
        agdict = row.loc["arcgis_details1"]
        if type(agdict) is dict:
            for key in agdict:
                outdf.set_value(i, key, agdict[key])

        agdict = row.loc["arcgis_details3"]
        if type(agdict) is dict:
            for key in agdict:
                outdf.set_value(i, key, agdict[key])

    # NUM RATINGS, RATING
    for i, row in indf.iterrows():
        print("Making ratings output features", i)
        num_ratings = row.loc["user_ratings_total"]
        if type(num_ratings) is float:
            outdf.set_value(i, "num_google_ratings", num_ratings)
        star_rating = row.loc["rating"]
        if type(star_rating) is float:
            outdf.set_value(i, "google_star_rating", star_rating)

    # drop cols without info 
    outdf = outdf.dropna()

    print(outdf)
    print(list(outdf))

    #df.to_pickle("preprocessed_data.pkl")

    return outdf

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


if __name__ == "__main__":
    process_data()

