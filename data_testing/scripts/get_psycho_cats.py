f = open("raw_data/Spatial_Los_Angeles_Oct1_2019.csv", "r")

f = f.readlines()[1]
f = f.split(",")
print(f[1:-1])
