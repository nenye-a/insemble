
import sys
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)  # include data_testing

import pprint
import utils

'''
File for environics data processing. 
'''

WEIGHTED_CATEGORIES = ["Current Year Median Age", "Current Year Average Age", "Current Year Median Household Income", "Current Year Average Household Income",
                       "Current Year Median Household Effective Buying Income", "Current Year Average Household Effective Buying Income",
                       "Five Year Median Household Income", "Five Year Average Household Income"]


def get_demographics(lat, lng, radius):
    """
    Get all the environics data for a latitude and longitude and radius.
    """

    blockgroups = utils.DB_REGIONS.find({'type': 'blockgroup', 'location': {
        '$near': {
            '$geometry': {
                'type': "Point",
                'coordinates': [lng, lat]
            },
            '$maxDistance': utils.miles_to_meters(radius)
        }
    }, 'environics_demographics': {'$exists': True}})

    if blockgroups.count() == 0:
        print("No blockgroups with environics data found!")
        return None

    blockgroups = list(blockgroups)

    # weight and add the median and averages
    total_population = round(sum(item["environics_demographics"]["Current Year Population, Gender"]["Current Year Population, Male"] +
                                 item["environics_demographics"]["Current Year Population, Gender"]["Current Year Population, Female"] for item in blockgroups))

    data = {}
    # data["Current Year Population, Gender"] =
    for demo_category in blockgroups[0]["environics_demographics"].keys():

        if isinstance(blockgroups[0]["environics_demographics"][demo_category], dict):
            data[demo_category] = {}
            for demo_sub_category in blockgroups[0]["environics_demographics"][demo_category]:
                data[demo_category][demo_sub_category] = round(sum(item["environics_demographics"]
                                                                   [demo_category][demo_sub_category] for item in blockgroups))
        else:
            if demo_category in WEIGHTED_CATEGORIES:
                data[demo_category] = 0
                for item in blockgroups:
                    population = item["environics_demographics"]["Current Year Population, Gender"]["Current Year Population, Male"] + \
                        item["environics_demographics"]["Current Year Population, Gender"]["Current Year Population, Female"]
                    weight = population / total_population
                    data[demo_category] += weight * item["environics_demographics"][demo_category]
                data[demo_category] = round(data[demo_category])
            else:
                data[demo_category] = round(sum(item["environics_demographics"][demo_category] for item in blockgroups))

    return data

# def get_demographics_deprecated(lat, lng, radius, demo_df, block_grp_df, cats):
#     """
#     (Deprecated) retrieves demographics using the previous method of leveraging
#     pandas dataframes with data. Latest method uses the information held within our block
#     groups to very quickly generate all the details required.

#     """

#     # get block groups overlapping w circle
#     block_grp_df["dist"] = block_grp_df.apply(
#         lambda row: utils.distance((row["lat"], row["lng"]), (lat, lng)), axis=1)
#     # isolate block groups that we want
#     df_trimmed = block_grp_df[block_grp_df["dist"] <= radius]

#     # get relevant spatial block groups
#     block_grps = [str(block) for block in list(df_trimmed["block_grp"])]

#     try:
#         demo_trimmed = demo_df[block_grps].copy()
#     except:
#         return None

#     # add weights for mean + median calc
#     # pop stats
#     pops = demo_trimmed[0:2].sum(axis=0)
#     weights = pops.div(sum(pops))
#     demo_trimmed.iloc[37] = demo_trimmed.iloc[37].multiply(weights)
#     demo_trimmed.iloc[38] = demo_trimmed.iloc[38].multiply(weights)
#     # household stats curr
#     households = demo_trimmed[57:69].sum(axis=0)
#     weights = households.div(sum(households))
#     demo_trimmed.iloc[69] = demo_trimmed.iloc[69].multiply(weights)
#     demo_trimmed.iloc[70] = demo_trimmed.iloc[70].multiply(weights)
#     demo_trimmed.iloc[83] = demo_trimmed.iloc[83].multiply(weights)
#     demo_trimmed.iloc[84] = demo_trimmed.iloc[84].multiply(weights)
#     # 5 yr household stats
#     households = demo_trimmed[116:128].sum(axis=0)
#     weights = households.div(sum(households))
#     demo_trimmed.iloc[128] = demo_trimmed.iloc[128].multiply(weights)
#     demo_trimmed.iloc[129] = demo_trimmed.iloc[129].multiply(weights)
#     demo_trimmed.iloc[142] = demo_trimmed.iloc[142].multiply(weights)
#     demo_trimmed.iloc[143] = demo_trimmed.iloc[143].multiply(weights)

#     # add shit together
#     sums = list(demo_trimmed.sum(axis=1))

#     # make ret dict
#     ret = {}
#     ret["Current Year Population, Gender"] = dict(zip(cats[0:2], sums[0:2]))
#     ret["Current Year Population, Race"] = dict(zip(cats[2:26], sums[2:26]))
#     ret["Current Year Population, Age"] = dict(zip(cats[26:37], sums[26:37]))
#     ret["Current Year Median Age"] = sums[37]
#     ret["Current Year Average Age"] = sums[38]
#     ret["Current Year Population 15+, Marital Status"] = dict(
#         zip(cats[39:51], sums[39:51]))
#     ret["Current Year Family Households"] = dict(zip(cats[51:57], sums[51:57]))
#     ret["Current Year Households, Household Income"] = dict(
#         zip(cats[57:69], sums[57:69]))
#     ret["Current Year Median Household Income"] = sums[69]
#     ret["Current Year Average Household Income"] = sums[70]
#     ret["Current Year Households, Effective Buying Income"] = dict(
#         zip(cats[71:83], sums[71:83]))
#     ret["Current Year Median Household Effective Buying Income"] = sums[83]
#     ret["Current Year Average Household Effective Buying Income"] = sums[84]
#     ret["Current Year Aggregate Household Effective Buying Income"] = sums[85]
#     ret["Current Year Population 25+, Education"] = dict(
#         zip(cats[86:94], sums[86:94]))
#     ret["Current Year Workers, Transportation to Work"] = dict(
#         zip(cats[94:100], sums[94:100]))
#     ret["Current Year Workers, Travel Time To Work"] = dict(
#         zip(cats[100:103], sums[100:103]))
#     ret["Five Year Population, Gender"] = dict(
#         zip(cats[103:105], sums[103:105]))
#     ret["Five Year Population, Age"] = dict(zip(cats[105:116], sums[105:116]))
#     ret["Five Year Households, Household Income"] = dict(
#         zip(cats[116:128], sums[116:128]))
#     ret["Five Year Median Household Income"] = sums[128]
#     ret["Five Year Average Household Income"] = sums[129]
#     ret["Five Year Households, Effective Buying Income"] = dict(
#         zip(cats[130:142], sums[130:142]))
#     ret["Five Year Median Household Effective Buying Income"] = sums[142]
#     ret["Five Year Average Household Effective Buying Income"] = sums[143]
#     ret["Five Year Aggregate Household Effective Buying Income"] = sums[144]

#     return ret


# def create_demo_cats_and_df():
#     spatial_dict = {}
#     f = open("raw_data/EA_Los_Angeles_PopFacts.csv", "r")
#     f = f.readlines()
#     for line in f[1:]:
#         line = line.rstrip().split(",")
#         if line[1] == "":
#             continue
#         spatial_dict[int(line[0])] = [float(line[i])
#                                       for i in range(1, len(line))]

#     # get categories
#     cats = f[0].rstrip().split("\"")
#     for i in range(len(cats) - 1, -1, -1):
#         if cats[i] == ",":
#             del cats[i]

#     return cats[1:-1], pd.DataFrame(data=spatial_dict)

# # create block group to lat, long dataframe


# def create_block_grp_df():
#     f = open("raw_data/cbg_geographic_data_LA.csv", "r")
#     f = f.readlines()
#     d = {"lat": [], "lng": [], "block_grp": []}
#     for line in f[1:]:
#         line = line.rstrip().split(",")
#         d["lat"].append(float(line[3]))
#         d["lng"].append(float(line[4]))
#         d["block_grp"].append(int(line[0]))

#     return pd.DataFrame(data=d)


if __name__ == "__main__":

    ret = get_demographics(33.829780, -118.350707, 3)
    pprint.pprint(ret)

    # cats, demo_df = create_demo_cats_and_df()
    # # print(len(cats))
    # for i, cat in enumerate(cats):
    #     print(i, cat)
    # # print(demo_df)

    # block_df = create_block_grp_df()

    # # ret = get_demographics(33.655615, -117.998786, 1, demo_df, block_df, cats)
    # # pprint.pprint(ret)

    # ret = get_demographics(33.655615, -117.998786, 3, demo_df, block_df, cats)
    # pprint.pprint(ret)

    # # ret = get_demographics(33.829780, -118.350707, 1, demo_df, block_df, cats)
    # # pprint.pprint(ret)

    # ret = get_demographics(33.829780, -118.350707, 3, demo_df, block_df, cats)
    # pprint.pprint(ret)

    # ret = get_demographics(33.829780, -118.350707, 3, new_matching.DEMO_DF, new_matching.BLOCK_DF, new_matching.DEMO_CATEGORIES)
    # pprint.pprint(ret)
