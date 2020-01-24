'''

File for spatial analytics data processing

'''

from utils import distance 
import pandas as pd


def weight(arr, const):
    for i in arr:
        i *= const

# get psychographics given lat and lng 
def get_psychographics(lat, lng, radius, spatial_dict):
    f = open("raw_data/cbg_geographic_data.csv", "r")
    f = f.readlines()
    d = {"lat": [], "lng": [], "block_grp": []}
    for line in f[1:5]:
        line = line.rstrip().split(",")
        d["lat"].append(float(line[3]))
        d["lng"].append(float(line[4]))
        d["block_grp"].append(int(line[0]))

    # get block groups overlapping w circle 
    df = pd.DataFrame(data=d)
    df["dist"] = df.apply(lambda row : distance((row["lat"], row["lng"]), (lat, lng)), axis = 1)
    df = df[df["dist"] <= radius]

    # get weighted psychographics
    for block_grp in df["block_grp"]:
        print(spatial_dict[block_grp][0])
        weight(spatial_dict[block_grp][0], spatial_dict[block_grp][1])
        print(spatial_dict[block_grp][0])

    return 

# put spatial data into dict for easy use  
def create_spatial_dict():
    spatial_dict = {}
    f = open("raw_data/Spatial_Los_Angeles_Oct1_2019.csv", "r")
    f = f.readlines()
    for line in f[2:]:
        line = line.rstrip().split(",")
        if line[1] == "":
            continue
        spatial_dict[int(line[0])] = [[float(line[i]) for i in range(1, len(line)-1)], line[-1]]

    return spatial_dict


if __name__ == "__main__":
    ret=get_psychographics(34.05, -118.24, 0.5, create_spatial_dict())
    print(ret)
