'''

File for spatial analytics data processing

'''

from utils import distance
import pandas as pd

# get psychographics given lat and lng
def get_psychographics(lat, lng, radius, spatial_df, block_grp_df, cats):
    # get block groups overlapping w circle
    block_grp_df["dist"] = block_grp_df.apply(
        lambda row: distance((row["lat"], row["lng"]), (lat, lng)), axis=1)
    # isolate block groups that we want
    df_trimmed = block_grp_df[block_grp_df["dist"] <= radius]

    # get relevant spatial block groups
    block_grps = list(df_trimmed["block_grp"])
    try:
        spatial_trimmed = spatial_df[block_grps]
    except:
        print("No spatial data on block group.")

    # compute result
    sums = list(spatial_trimmed.sum(axis=1))

    # If the weighted total does not exist, the data is not valid. Return None
    if sums[-1] == 0:
        return None
    data = [sums[i]/sums[-1] for i in range(0, len(sums)-1)]

    return dict(zip(cats, data))


# create dataframe with all spatial data
def create_spatial_cats_and_df():
    spatial_dict = {}
    f = open("raw_data/Spatial_Los_Angeles_Oct1_2019.csv", "r")
    f = f.readlines()
    for line in f[2:]:
        line = line.rstrip().split(",")
        if line[1] == "":
            continue
        spatial_dict[int(line[0])] = [float(line[i])*float(line[-1])
                                      for i in range(1, len(line)-1)] + [float(line[-1])]

    # get categories
    cats = f[1].rstrip().split(",")[1:-1]

    return cats, pd.DataFrame(data=spatial_dict)


# create block group to lat, long dataframe
def create_block_grp_df():
    f = open("raw_data/cbg_geographic_data_LA.csv", "r")
    f = f.readlines()
    d = {"lat": [], "lng": [], "block_grp": []}
    for line in f[1:]:
        line = line.rstrip().split(",")
        d["lat"].append(float(line[3]))
        d["lng"].append(float(line[4]))
        d["block_grp"].append(int(line[0]))

    return pd.DataFrame(data=d)


if __name__ == "__main__":
    cats, spatial_df = create_spatial_cats_and_df()
    block_df = create_block_grp_df()

    ret = get_psychographics(34.0523, -118.2395, 0.5,
                             spatial_df, block_df, cats)
    print(ret)
    ret = get_psychographics(34.0430, -118.2673, 0.5,
                             spatial_df, block_df, cats)
    print(ret)
