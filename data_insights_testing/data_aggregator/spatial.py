'''

File for spatial analytics data processing

'''

from utils import distance 
import pandas as pd


def weight(arr, const):
    for i in arr:
        i *= const

# get psychographics given lat and lng 
def get_psychographics(lat, lng, radius, spatial_df, block_grp_df):

    # get block groups overlapping w circle 
    block_grp_df["dist"] = block_grp_df.apply(lambda row : distance((row["lat"], row["lng"]), (lat, lng)), axis = 1)

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
    return [sums[i]/sums[-1] for i in range(0, len(sums)-1)]


# create dataframe with all spatial data
def create_spatial_df():
    spatial_dict = {}
    f = open("raw_data/Spatial_Los_Angeles_Oct1_2019.csv", "r")
    f = f.readlines()
    for line in f[2:]:
        line = line.rstrip().split(",")
        if line[1] == "":
            continue
        spatial_dict[int(line[0])] = [float(line[i])*float(line[-1]) for i in range(1, len(line)-1)] + [float(line[-1])]

    return pd.DataFrame(data=spatial_dict)

# create block group to lat, long dataframe
def create_block_grp_df():
    f = open("raw_data/cbg_geographic_data.csv", "r")
    f = f.readlines()
    d = {"lat": [], "lng": [], "block_grp": []}
    for line in f[1:]:
        line = line.rstrip().split(",")
        d["lat"].append(float(line[3]))
        d["lng"].append(float(line[4]))
        d["block_grp"].append(int(line[0]))

    return pd.DataFrame(data=d)

if __name__ == "__main__":
    ret=get_psychographics(34.0523, -118.2395, 0.5, create_spatial_df(), create_block_grp_df())
    print(ret)
