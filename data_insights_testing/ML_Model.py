import pandas as pd
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
