# get pitney retail categories

src_loc = "CategoryCodes.csv"
dest_loc = "pitney_categories.txt"

inp = open(src_loc, "r")
inp = inp.readlines()
out = open(dest_loc, "w")
for line in inp:
    line = line.rstrip()
    line = line.split(",")

    #if line[0] == "Division I. - Services":
    if line[0] == "Division G. - Retail Trade":
        out.write(line[-1])
        out.write("\n")
out.close()


