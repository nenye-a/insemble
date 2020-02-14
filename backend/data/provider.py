from . import utils, matching
import json
import pandas as pd
import data.api.goog as google
import data.api.spatial as spatial
import data.api.arcgis as arcgis
import data.api.environics as environics


'''

This file will the main provider of key details that need to leverage the api. This will be the interface
between the main application api, and our calls data_api calls.

'''


# Return the location latitude and object details. Details are in the following form
# {lat:float, lng:float}
def get_location(address, name=None):
    return google.find(address, name, allow_non_establishments=True)['geometry']['location']


def get_key_facts(lat, lng):

    radius_miles = 1
    population_threshold = 100000

    # retrieve details for one mile. If they don't look satisfactory,
    # move on to three miles
    arcgis_details = arcgis.details(lat, lng, 1)

    if arcgis_details['DaytimePop'] < population_threshold:
        radius_miles = 3
        arcgis_details = arcgis.details(lat, lng, 3)

    num_metro = len(google.nearby(lat, lng, 'subway_station', radius=radius_miles))
    num_universities = len(google.nearby(lat, lng, 'university', radius=radius_miles))
    num_hospitals = len(google.nearby(lat, lng, 'hospital', radius=radius_miles))
    num_apartments = len(google.search(lat, lng, 'apartments', radius=radius_miles))

    return {
        'mile': radius_miles,
        'DaytimePop': arcgis_details['DaytimePop'],
        'MedHouseholdIncome': arcgis_details['MedHouseholdIncome'],
        'TotalHousholds': arcgis_details['TotalHouseholds'],
        'HouseholdGrowth2017-2022': arcgis_details['HouseholdGrowth2017-2022'],
        'num_metro': num_metro,
        'num_universities': num_universities,
        'num_hospitals': num_hospitals,
        'num_apartments': num_apartments
    }


def get_demographics(lat, lng, radius):

    demographics = environics.get_demographics(
        lat, lng, 1, matching.DEMO_DF, matching.BLOCK_DF, matching.DEMO_CATEGORIES)

    age, income, ethnicity, education, gender = {}, {}, {}, {}, {}

    # parse age
    # all the data is referred to by index on the matching algorithm (refer to matching)
    age_demographics = demographics["Current Year Population, Age"]
    age_demographics_fiveyear = demographics["Five Year Population, Age"]
    five_year_age = [value.replace("Current", "Five") for value in matching.AGE_LIST]

    age = {
        '<18': {
            'value': add_dictionary_values(age_demographics, matching.AGE_LIST[0:4]),
            'growth': growth(
                add_dictionary_values(age_demographics, matching.AGE_LIST[0:4]),
                add_dictionary_values(age_demographics_fiveyear, five_year_age[0:4]))
        },
        '18-24': {
            'value': add_dictionary_values(age_demographics, matching.AGE_LIST[4:5]),
            'growth': growth(
                add_dictionary_values(age_demographics, matching.AGE_LIST[4:5]),
                add_dictionary_values(age_demographics_fiveyear, five_year_age[4:5]))
        },
        '25-34': {
            'value': age_demographics["Current Year Population, Age 25 - 34"],
            'growth': growth(
                age_demographics["Current Year Population, Age 25 - 34"],
                age_demographics_fiveyear["Five Year Population, Age 25 - 34"])
        },
        '35-44': {
            'value': age_demographics["Current Year Population, Age 35 - 44"],
            'growth': growth(
                age_demographics["Current Year Population, Age 35 - 44"],
                age_demographics_fiveyear["Five Year Population, Age 35 - 44"])
        },
        '45-54': {
            'value': age_demographics["Current Year Population, Age 45 - 54"],
            'growth': growth(
                age_demographics["Current Year Population, Age 45 - 54"],
                age_demographics_fiveyear["Five Year Population, Age 45 - 54"])
        },
        '55-64': {
            'value': age_demographics["Current Year Population, Age 55 - 64"],
            'growth': growth(
                age_demographics["Current Year Population, Age 55 - 64"],
                age_demographics_fiveyear["Five Year Population, Age 55 - 64"])
        },
        '65+': {
            'value': age_demographics["Current Year Population, Age 65+"],
            'growth': growth(
                age_demographics["Current Year Population, Age 65+"],
                age_demographics_fiveyear["Five Year Population, Age 65+"])
        }
    }

    # parse income
    income_demographics = demographics["Current Year Households, Household Income"]
    income_demographics_fiveyear = demographics["Five Year Households, Household Income"]
    five_year_income = [value.replace("Current", "Five") for value in matching.INCOME_LIST]

    income = {
        '<50K': {
            'value': add_dictionary_values(income_demographics, matching.INCOME_LIST[0:4]),
            'growth': growth(
                add_dictionary_values(income_demographics, matching.INCOME_LIST[0:4]),
                add_dictionary_values(income_demographics_fiveyear, five_year_income[0:4]))
        },
        '$50K-$74K': {
            'value': income_demographics["Current Year Households, Household Income $50,000 - $74,999"],
            'growth': growth(
                income_demographics["Current Year Households, Household Income $50,000 - $74,999"],
                income_demographics_fiveyear["Five Year Households, Household Income $50,000 - $74,999"])
        },
        '$75K-$124K': {
            'value': add_dictionary_values(income_demographics, matching.INCOME_LIST[5:7]),
            'growth': growth(
                add_dictionary_values(income_demographics, matching.INCOME_LIST[5:7]),
                add_dictionary_values(income_demographics_fiveyear, five_year_income[5:7]))
        },
        '$125K-$199K': {
            'value': add_dictionary_values(income_demographics, matching.INCOME_LIST[7:9]),
            'growth': growth(
                add_dictionary_values(income_demographics, matching.INCOME_LIST[7:9]),
                add_dictionary_values(income_demographics_fiveyear, five_year_income[7:9]))
        },
        '$200K+': {
            'value': add_dictionary_values(income_demographics, matching.INCOME_LIST[9:]),
            'growth': growth(
                add_dictionary_values(income_demographics, matching.INCOME_LIST[9:]),
                add_dictionary_values(income_demographics_fiveyear, five_year_income[9:])
            )
        }
    }

    # parse ethnicity (future ethnicity growth not provided right now)
    ethnicity_demographics = demographics["Current Year Population, Race"]
    # ethnicity_demographics_fiveyear = demographics["Five Year Population, Race"]

    ethnicity = {
        'white': {
            'value': ethnicity_demographics["Current Year Population, White Alone"],
            # 'growth': growth(
            #     ethnicity_demographics["Current Year Population, White Alone"],
            #     ethnicity_demographics_fiveyear["Five Year Population, White Alone"])
        },
        'black': {
            'value': ethnicity_demographics["Current Year Population, Black/African American Alone"],
            # 'growth': growth(
            #     ethnicity_demographics["Current Year Population, Black/African American Alone"],
            #     ethnicity_demographics_fiveyear["Five Year Population, Black/African American Alone"])
        },
        'indian': {
            'value': ethnicity_demographics["Current Year Population, American Indian/Alaskan Native Alone"],
            # 'growth': growth(
            #     ethnicity_demographics["Current Year Population, American Indian/Alaskan Native Alone"],
            #     ethnicity_demographics_fiveyear["Five Year Population, American Indian/Alaskan Native Alone"]
            # )
        },
        'asian': {
            'value': ethnicity_demographics["Current Year Population, Asian Alone"],
            # 'growth': growth(
            #     ethnicity_demographics["Current Year Population, Asian Alone"],
            #     ethnicity_demographics_fiveyear["Five Year Population, Asian Alone"])
        },
        'pacific_islander': {
            'value': ethnicity_demographics["Current Year Population, Native Hawaiian/Pacific Islander Alone"],
            # 'growth': growth(
            #     ethnicity_demographics["Current Year Population, Native Hawaiian/Pacific Islander Alone"],
            #     ethnicity_demographics_fiveyear["Five Year Population, Native Hawaiian/Pacific Islander Alone"])
        },
        'other': {
            'value': ethnicity_demographics["Current Year Population, Some Other Race Alone"],
            # 'growth': growth(
            #     ethnicity_demographics["Current Year Population, Some Other Race Alone"],
            #     ethnicity_demographics_fiveyear["Five Year Population, Some Other Race Alone"])
        }
    }

    # parse education (future education growth not present right now)
    education_demographics = demographics["Current Year Population 25+, Education"]
    # education_demographics_fiveyear = demographics["Five Year Population 25+, Education"]

    education = {
        'some_highschool': {
            'value': education_demographics["Current Year Population 25+, Some High School, No Diploma"],
            # 'growth': growth(
            #     education_demographics["Current Year Population 25+, Some High School, No Diploma"],
            #     education_demographics_fiveyear["Five Year Population 25+, Some High School, No Diploma"])
        },
        'high_school': {
            'value': education_demographics["Current Year Population 25+, High School Graduate (Including Equivalent)"],
            # 'growth': growth(
            #     education_demographics["Current Year Population 25+, High School Graduate (Including Equivalent)"],
            #     education_demographics_fiveyear["Five Year Population 25+, High School Graduate (Including Equivalent)"])
        },
        'some_college': {
            'value': education_demographics["Current Year Population 25+, Some College, No Degree"],
            # 'growth': growth(
            #     education_demographics["Current Year Population 25+, Some College, No Degree"],
            #     education_demographics_fiveyear["Five Year Population 25+, Some College, No Degree"])
        },
        'associate': {
            'value': education_demographics["Current Year Population 25+, Associate's Degree"],
            # 'growth': growth(
            #     education_demographics["Current Year Population 25+, Associate's Degree"],
            #     education_demographics_fiveyear["Five Year Population 25+, Associate's Degree"])
        },
        'bachelor': {
            'value': education_demographics["Current Year Population 25+, Bachelor's Degree"],
            # 'growth': growth(
            #     education_demographics["Current Year Population 25+, Bachelor's Degree"],
            #     education_demographics_fiveyear["Five Year Population 25+, Bachelor's Degree"])
        },
        'masters': {
            'value': education_demographics["Current Year Population 25+, Master's Degree"],
            # 'growth': growth(
            #     education_demographics["Current Year Population 25+, Master's Degree"],
            #     education_demographics_fiveyear["Five Year Population 25+, Master's Degree"])
        },
        'professional': {
            'value': education_demographics["Current Year Population 25+, Professional Degree"],
            # 'growth': growth(
            #     education_demographics["Current Year Population 25+, Professional Degree"],
            #     education_demographics_fiveyear["Five Year Population 25+, Professional Degree"])
        },
        'doctorate': {
            'value': education_demographics["Current Year Population 25+, Doctorate Degree"],
            # 'growth': growth(
            #     education_demographics["Current Year Population 25+, Doctorate Degree"],
            #     education_demographics_fiveyear["Five Year Population 25+, Doctorate Degree"])
        }
    }

    # parse gender
    gender_demographics = demographics["Current Year Population, Gender"]
    gender_demographics_fiveyear = demographics["Five Year Population, Gender"]

    gender['female'] = gender_demographics["Current Year Population, Female"]
    gender['male'] = gender_demographics["Current Year Population, Male"]

    gender = {
        'female': {
            'value': gender_demographics["Current Year Population, Female"],
            'growth': growth(
                gender_demographics["Current Year Population, Female"],
                gender_demographics_fiveyear["Five Year Population, Female"])
        },
        'male': {
            'value': gender_demographics["Current Year Population, Male"],
            'growth': growth(
                gender_demographics["Current Year Population, Male"],
                gender_demographics_fiveyear["Five Year Population, Male"])
        }
    }

    # parse commute
    commute_demographics = demographics["Current Year Workers, Transportation to Work"]
    commute = {
        key.replace("Current Year Workers, Transportation To Work: ", ""): value for key, value in commute_demographics.items()
    }

    return {
        'age': age,
        'income': income,
        'ethnicity': ethnicity,
        'education': education,
        'gender': gender,
        'commute': commute
    }


# Helper function to add up all the values in a dictionary given the dictionary and
# all the values that we would want to add. Should be moved to utils at some point
# dictionary + list of all the keys of the items that should be added
def add_dictionary_values(dictionary, values):
    sum_items = [dictionary[value] for value in values]
    return sum(sum_items)

# calculate the growth from one number to the next
# will likely be moved to utils


def growth(current, future):
    return 100 * float(future - current) / current


def get_nearby(lat, lng, categories):

    similar_places = []
    for category in categories:
        similar_places += google.search(lat, lng, category, 1)

    nearby_dict = {}
    for place in similar_places:
        if place["place_id"] in nearby_dict:
            continue
        detailed_place = _update_place(place["place_id"], lat, lng, categories)
        if not detailed_place:
            # TODO: store the google ids of places we do not have to obtain later in the database
            # in the short term, will just ignore them
            continue
        nearby_dict[place["place_id"]] = detailed_place

    # TODO: add additional functions that better estimate if a store is similar to another
    for place in google.nearby(lat, lng, 'store', 1):
        if place["place_id"] not in nearby_dict:
            detailed_place = _update_place(place["place_id"], lat, lng, categories)
            if not detailed_place:
                continue
            nearby_dict[place["place_id"]] = detailed_place
        nearby_dict[place["place_id"]]["retail"] = True

    for place in google.nearby(lat, lng, 'restaurant', 1):
        if place["place_id"] not in nearby_dict:
            detailed_place = _update_place(place["place_id"], lat, lng, categories)
            if not detailed_place:
                continue
            nearby_dict[place["place_id"]] = detailed_place
        nearby_dict[place["place_id"]]["restaurant"] = True

    return list(nearby_dict.values())


# update place & provide distance to another place
def _update_place(place_id, lat, lng, categories):
    place = utils.DB_PROCESSED_SPACE.find_one({'place_id': place_id})
    if not place:
        return None

    this_location_lat = place["geometry"]["location"]["lat"]
    this_location_lng = place["geometry"]["location"]["lng"]
    name = place["name"]
    rating = place["rating"] if "rating" in place else None
    number_rating = place["user_ratings_total"] if "user_ratings_total" in place else None

    distance = round(utils.distance((lat, lng), (this_location_lat, this_location_lng)), 2)

    category = None
    similar = False

    if "foursquare_categories" in place and len(place["foursquare_categories"]) > 0:
        category = place["foursquare_categories"][0]["category_name"]
        if category in categories:
            similar = True

    return {
        'lat': this_location_lat,
        'lng': this_location_lng,
        'name': name,
        'rating': rating,
        'number_rating': number_rating,
        'category': category,
        'distance': distance,
        'similar': similar
    }
