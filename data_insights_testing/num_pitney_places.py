# get num of service + retail places in LA in pitney bowes data set

import requests

sics = open("pitney_sics.txt", "r")
sics = sics.readlines()

zipcodes = open("la_zipcodes.txt", "r")
zipcodes = zipcodes.readlines()[0].split()

total = 0

for zipcode in zipcodes:
    print()
    print(zipcode)
    for sic in sics:
        sic = sic.rstrip().split()[0]

        page_num = 1
        max_cand = 1

        url = "https://api.pitneybowes.com/location-intelligence/geoenrich/v1/poi/byarea?country=USA&areaName1=CA&areaName3=Los%20Angeles&postcode1={}&sicCode={}&maxCandidates={}&fuzzyOnName=N&page={}".format(
            zipcode, sic, max_cand, page_num)
        payload = {}
        headers = {
            'Authorization': 'Bearer jrFtZOcvWAIRVCyMvhRkzHgA5ESY'
        }

        response = requests.request("GET", url, headers=headers, data=payload)
        # print(response.text.encode('utf8'))
        response = response.json()
        if response == {}:
            continue

        new_places = int(response["totalMatchingCandidates"])
        total += new_places
        print("new places %s, curr total %s)" % (new_places, total))

print("TOTAL in LA %s" % (total))
