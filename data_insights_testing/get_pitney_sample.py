# get a sample of data for one zip code

import requests

out = open("pitney_sample.txt", "w")

zipcodes = [90001, 90002, 90003, 90004, 90005, 90006, 90007, 90008, 90009]
for zipcode in zipcodes[0:5]:

    cats = open("pitney_categories.txt", "r")
    cats = cats.readlines()
    for cat in cats:
        cat = cat.rstrip().split()[0]

        page_num = 1
        max_cand = 100

        while True:

            url = "https://api.pitneybowes.com/location-intelligence/geoenrich/v1/poi/byarea?country=USA&areaName1=CA&areaName3=Los%20Angeles&postcode1={}&categoryCode={}&maxCandidates={}&fuzzyOnName=N&page={}".format(
                zipcode, cat, max_cand, page_num)
            payload = {}
            headers = {
                'Authorization': 'Bearer jrFtZOcvWAIRVCyMvhRkzHgA5ESY'
            }

            response = requests.request("GET", url, headers=headers, data=payload)
            print(response.text.encode('utf8'))
            response = response.json()
            if response == {}:
                break

            out.write(str(response))
            out.write("\n")
            if page_num * max_cand >= int(response["totalMatchingCandidates"]):
                break

            page_num += 1
