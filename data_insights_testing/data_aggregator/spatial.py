'''
File for spatial analytics data processing
'''

import utils
import pprint
# import pandas as pd


def get_psychographics(lat, lng, radius):
    """
    Given a location (lat, lng) and a radius will return all the psychographic details for
    this location.
    """

    blockgroups = utils.DB_REGIONS.find({'type': 'blockgroup', 'location': {
        '$near': {
            '$geometry': {
                'type': "Point",
                'coordinates': [lng, lat]
            },
            '$maxDistance': utils.miles_to_meters(radius)
        }
    }, 'spatial_psychographics': {'$exists': True}})

    if blockgroups.count() == 0:
        print("No blockgroups with spatial data found!")
        return None

    blockgroups = list(blockgroups)

    total_weight = sum(blockgroup["spatial_psychographics"].pop("volume_percentile") for blockgroup in blockgroups)

    data = {}
    for psychographic in blockgroups[0]["spatial_psychographics"].keys():
        data[psychographic] = round(sum(item["spatial_psychographics"][psychographic] for item in blockgroups) / total_weight)

    return data


# def get_psychographics_deprecated(lat, lng, radius, spatial_df, block_grp_df, cats):
#     """
#     (Deprecated) Deperecated method to get all the psychographics within a location.
#     Leverages spatial dataframe and blockgroup dataframe to gather all the information
#     required.

#     Returns all the psychographcis for a particular region.

#     """

#     # get block groups overlapping w circle
#     block_grp_df["dist"] = block_grp_df.apply(
#         lambda row: utils.distance((row["lat"], row["lng"]), (lat, lng)), axis=1)
#     # isolate block groups that we want
#     df_trimmed = block_grp_df[block_grp_df["dist"] <= radius]

#     # get relevant spatial block groups
#     block_grps = [str(block) for block in list(df_trimmed["block_grp"])]

#     try:
#         spatial_trimmed = spatial_df[block_grps]
#     except:
#         print("No spatial data on block group.")

#     # compute result
#     sums = list(spatial_trimmed.sum(axis=1))

#     # If the weighted total does not exist, the data is not valid. Return None
#     if sums[-1] == 0:
#         return None
#     data = [sums[i] / sums[-1] for i in range(0, len(sums) - 1)]

#     return dict(zip(cats, data))


# # create dataframe with all spatial data
# def create_spatial_cats_and_df():
#     spatial_dict = {}
#     f = open("raw_data/Spatial_Los_Angeles_Oct1_2019.csv", "r")
#     f = f.readlines()
#     for line in f[2:]:
#         line = line.rstrip().split(",")
#         if line[1] == "":
#             continue
#         spatial_dict[int(line[0])] = [float(line[i]) * float(line[-1])
#                                       for i in range(1, len(line) - 1)] + [float(line[-1])]

#     # get categories
#     cats = f[1].rstrip().split(",")[1:-1]

#     return cats, pd.DataFrame(data=spatial_dict)


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

    ret = get_psychographics(34.0731229, -118.3728627, 5)
    pprint.pprint(ret)

    # cats, spatial_df = create_spatial_cats_and_df()
    # block_df = create_block_grp_df()

    # ret = get_psychographics(33.655615, -117.998786, 1,
    #                          spatial_df, block_df, cats)
    # pprint.pprint(ret)
    # ret = get_psychographics(33.655615, -117.998786, 3,
    #                          spatial_df, block_df, cats)
    # print("3")
    # pprint.pprint(ret)

    # ret = get_psychographics_new(33.655615, -117.998786, 3)
    # pprint.pprint(ret)
