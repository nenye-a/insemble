'''

File for spatial analytics data processing

'''

from utils import distance 
import pandas as pd
import time

# get blocks in LA
spatial_dict = {}
f = open("raw_data/Spatial_Los_Angeles_Oct1_2019.csv", "r")
f = f.readlines()
la_blocks = []
for line in f[2:]:
    line = line.rstrip().split(",")
    if line[1] == "":
        continue
    la_blocks.append(int(line[0]))

# keep only lines corresponding to blocks in LA
f2 = open("raw_data/cbg_geographic_data.csv", "r")
f2 = f2.readlines()
out = open("raw_data/cbg_geographic_data_LA.csv", "w")

for line in f2[1:]:
    line_split = line.rstrip().split(",")
    if int(line_split[0]) in la_blocks:
        out.write(line)


