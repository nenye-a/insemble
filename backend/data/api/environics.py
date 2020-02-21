'''

File for environics data processing. 

'''

from data.utils import distance
# import pandas as pd

# get demographics given lat and lng


def get_demographics(lat, lng, radius, demo_df, block_grp_df, cats):
    # get block groups overlapping w circle
    block_grp_df["dist"] = block_grp_df.apply(
        lambda row: distance((row["lat"], row["lng"]), (lat, lng)), axis=1)
    # isolate block groups that we want
    df_trimmed = block_grp_df[block_grp_df["dist"] <= radius]

    # get relevant spatial block groups
    block_grps = [str(block) for block in list(df_trimmed["block_grp"])]

    try:
        demo_trimmed = demo_df[block_grps].copy()
    except:
        return None

    # add weights for mean + median calc
    # pop stats
    pops = demo_trimmed[0:2].sum(axis=0)
    weights = pops.div(sum(pops))
    demo_trimmed.iloc[37] = demo_trimmed.iloc[37].multiply(weights)
    demo_trimmed.iloc[38] = demo_trimmed.iloc[38].multiply(weights)
    # household stats curr
    households = demo_trimmed[57:69].sum(axis=0)
    weights = households.div(sum(households))
    demo_trimmed.iloc[69] = demo_trimmed.iloc[69].multiply(weights)
    demo_trimmed.iloc[70] = demo_trimmed.iloc[70].multiply(weights)
    demo_trimmed.iloc[83] = demo_trimmed.iloc[83].multiply(weights)
    demo_trimmed.iloc[84] = demo_trimmed.iloc[84].multiply(weights)
    # 5 yr household stats
    households = demo_trimmed[116:128].sum(axis=0)
    weights = households.div(sum(households))
    demo_trimmed.iloc[128] = demo_trimmed.iloc[128].multiply(weights)
    demo_trimmed.iloc[129] = demo_trimmed.iloc[129].multiply(weights)
    demo_trimmed.iloc[142] = demo_trimmed.iloc[142].multiply(weights)
    demo_trimmed.iloc[143] = demo_trimmed.iloc[143].multiply(weights)

    # add shit together
    sums = list(demo_trimmed.sum(axis=1))

    # make ret dict
    ret = {}
    ret["Current Year Population, Gender"] = dict(zip(cats[0:2], sums[0:2]))
    ret["Current Year Population, Race"] = dict(zip(cats[2:26], sums[2:26]))
    ret["Current Year Population, Age"] = dict(zip(cats[26:37], sums[26:37]))
    ret["Current Year Median Age"] = sums[37]
    ret["Current Year Average Age"] = sums[38]
    ret["Current Year Population 15+, Marital Status"] = dict(
        zip(cats[39:51], sums[39:51]))
    ret["Current Year Family Households"] = dict(zip(cats[51:57], sums[51:57]))
    ret["Current Year Households, Household Income"] = dict(
        zip(cats[57:69], sums[57:69]))
    ret["Current Year Median Household Income"] = sums[69]
    ret["Current Year Average Household Income"] = sums[70]
    ret["Current Year Households, Effective Buying Income"] = dict(
        zip(cats[71:83], sums[71:83]))
    ret["Current Year Median Household Effective Buying Income"] = sums[83]
    ret["Current Year Average Household Effective Buying Income"] = sums[84]
    ret["Current Year Aggregate Household Effective Buying Income"] = sums[85]
    ret["Current Year Population 25+, Education"] = dict(
        zip(cats[86:94], sums[86:94]))
    ret["Current Year Workers, Transportation to Work"] = dict(
        zip(cats[94:100], sums[94:100]))
    ret["Current Year Workers, Travel Time To Work"] = dict(
        zip(cats[100:103], sums[100:103]))
    ret["Five Year Population, Gender"] = dict(
        zip(cats[103:105], sums[103:105]))
    ret["Five Year Population, Age"] = dict(zip(cats[105:116], sums[105:116]))
    ret["Five Year Households, Household Income"] = dict(
        zip(cats[116:128], sums[116:128]))
    ret["Five Year Median Household Income"] = sums[128]
    ret["Five Year Average Household Income"] = sums[129]
    ret["Five Year Households, Effective Buying Income"] = dict(
        zip(cats[130:142], sums[130:142]))
    ret["Five Year Median Household Effective Buying Income"] = sums[142]
    ret["Five Year Average Household Effective Buying Income"] = sums[143]
    ret["Five Year Aggregate Household Effective Buying Income"] = sums[144]

    return ret
