import utils

ARCGIS_LIST = ["DaytimePop",
               "DaytimeWorkingPop",
               "DaytimeResidentPop",
               "TotalHouseholds",
               "HouseholdGrowth2017-2022",
               "MedHouseholdIncome"]

rename_dict = {}
for item in ARCGIS_LIST:
    query_item = item + "-" if item == "HouseholdGrowth2017-2022" else item

    correct_name_1mile = 'arcgis_demographics.1mile.' + item
    incorrect_name_1mile = 'arcgis_demographics.1mile.' + query_item + "1"
    correct_name_3mile = 'arcgis_demographics.3mile.' + item
    incorrect_name_3mile = 'arcgis_demographics.3mile.' + query_item + "3"

    rename_dict[incorrect_name_1mile] = correct_name_1mile
    rename_dict[incorrect_name_3mile] = correct_name_3mile

utils.DB_LOCATIONS.update_many({incorrect_name_1mile: {'$exists': True}}, {'$rename': rename_dict})
