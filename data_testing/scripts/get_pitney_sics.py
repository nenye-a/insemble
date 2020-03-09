# get pitney retail categories

src_loc = "SICCodes.csv"
dest_loc = "pitney_sics.txt"

inp = open(src_loc, "r")
inp = inp.readlines()
out = open(dest_loc, "w")
for line in inp:
    line = line.rstrip()
    line = line.split(",")

    if line[1][0:8] == "SERVICES" or line[1][0:6] == "RETAIL":
        out.write(line[0])
        out.write("\n")
out.close()
