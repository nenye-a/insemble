inp = open("pitney_sample.txt", "r")

out = open("sample_coords.csv", "w")

num_stores = 0
num_sales = 0
for dic in inp:
    dic = eval(dic)

    poi_list = dic["poi"]
    for poi in poi_list:
        print(poi)
        num_stores += 1
        if "salesVolume" in poi:
            sales = poi["salesVolume"][0]["value"]
            print(sales)
            if sales != "0":
                num_sales += 1

        # csv stuff for plotting
        loc = poi["geometry"]["coordinates"]
        out.write(poi["name"] + "," + str(loc[0]) + "," + str(loc[1]))
        out.write("\n")

out.close()

print()
print("%s stores and %s stores with sales data" % (num_stores, num_sales))
