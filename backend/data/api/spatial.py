'''

File for spatial analytics data processing

'''

from utils import distance
# import pandas as pd

# get psychographics given lat and lng


def get_psychographics(lat, lng, radius, spatial_df, block_grp_df, cats):
    # get block groups overlapping w circle
    block_grp_df["dist"] = block_grp_df.apply(
        lambda row: distance((row["lat"], row["lng"]), (lat, lng)), axis=1)
    # isolate block groups that we want
    df_trimmed = block_grp_df[block_grp_df["dist"] <= radius]

    # get relevant spatial block groups
    block_grps = [str(block) for block in list(df_trimmed["block_grp"])]

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
