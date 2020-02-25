from . import utils, matching
from bson import ObjectId
import numpy as np
import time
import re
import pandas as pd
import data.api.goog as google
import data.api.foursquare as foursquare
import data.api.arcgis as arcgis
import data.api.environics as environics
import data.api.anmspatial as anmspatial
import data.api.spatial as spatial


'''

This file will the main provider of key details that need to leverage the api. This will be the interface
between the main application api, and our calls data_api calls.

'''

# TODO: place in database
EQUIPMENT_LIST = ["Walk-in fridge", "Reach-in fridge", "Walk-in freezer", "Grease trap", "Fumehood", "Frier ", "Grill ", "Stove ",
                  "ADA Compliant Bathrooms", "Bathroom", "Oven", "Convection Oven", "Conveyor Oven", "Combination Oven", "Pizza Oven",
                  "Parking Lot", "Street Parking", "Compartment Sink", "Hand Sink", "Underbar sink", "Alarm System", "240V Outlets",
                  "120V Outlets", "Storage Space", "Concrete floor", "Wood Floor", "Tile floor", "Brick walls", "Wood walls",
                  "Sheetrock", "Concrete", ]

# Return the location latitude and object details. Details are in the following form
# {lat:float, lng:float, place_id:'place_id}


def get_location(address, name=None):
    google_location = google.find(address, name=name, allow_non_establishments=True, save=False)
    location = google_location['geometry']['location']
    location["place_id"] = google_location["place_id"]
    return location


def get_representative_location(categories, income_dict):

    income_query = {'$gte': income_dict["min"]}
    income_query.update({'$lte': income_dict["max"]}) if 'max' in income_dict else None

    candidates = utils.DB_PROCESSED_SPACE.find({
        'foursquare_categories.category_name': {'$in': categories},
        'arcgis_details1.MedHouseholdIncome1': income_query,
        'arcgis_details3.MedHouseholdIncome3': income_query,
        'user_ratings_total': {'$exists': True},
        'rating': {'$gte': 4.2}
    }).sort([('user_ratings_total', -1)]).limit(10)

    if candidates.count() == 0:
        return None

    place = list(candidates)[0]
    return {
        'address': place['formatted_address'],
        'lat': place['geometry']['location']['lat'],
        'lng': place['geometry']['location']['lng'],
        'name': place['name']
    }

# Returns the address and neighborhood of a specific latitude and longitude


def get_address_neighborhood(lat, lng):

    google_location = google.reverse_geocode(lat, lng, save=False)
    address = google_location['formatted_address'].split(',')[0]
    neighborhood = None
    locality = None
    for component in google_location['address_components']:
        if 'neighborhood' in component['types']:
            neighborhood = component['short_name']
        if 'locality' in component['types']:
            locality = component['short_name']

    # return both neighborhood and locality, but return None if neighther are present
    if neighborhood:
        neighborhood = neighborhood + ', ' + locality if locality else neighborhood
    else:
        neighborhood = locality

    return {
        'address': address,
        'neighborhood': neighborhood
    }


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


# get demographics. If no existing demographic vector it will grab demographics. If a demographic
# vector is provided, then lat, lng, and arius are ignored.


def get_demographics(lat, lng, radius, demographic_dict=None):
    """
    get demographics. If no existing demographic vector it will grab demographics. If a demographic
    vector is provided, then lat, lng, and arius are ignored.
    """

    if demographic_dict:
        demographics = demographic_dict
    else:
        demographics = environics.get_demographics(
            lat, lng, radius, matching.DEMO_DF, matching.BLOCK_DF, matching.DEMO_CATEGORIES)

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
    strip_header = re.compile("Current year workers, transportation to work: ", re.IGNORECASE)
    commute = {
        strip_header.sub("", key): value for key, value in commute_demographics.items()
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


def obtain_nearby(target_location, categories):

    nearby_dict = {}

    def item_into_dict(full_dict, place):
        full_dict[place['place_id']] = {
            'place_id': place['place_id'],
            'distance': place['distance'] if place['distance'] else None
        }

    lat = target_location['geometry']['location']['lat']
    lng = target_location['geometry']['location']['lng']

    for place in target_location['nearby_store']:
        if place["place_id"] not in nearby_dict:
            item_into_dict(nearby_dict, place)
        nearby_dict[place["place_id"]]["retail"] = True

    for place in target_location['nearby_restaurant']:
        if place["place_id"] not in nearby_dict:
            item_into_dict(nearby_dict, place)
        nearby_dict[place["place_id"]]["restaurant"] = True

    for place in target_location['nearby_apartments']:
        if place["place_id"] not in nearby_dict:
            item_into_dict(nearby_dict, place)
        nearby_dict[place["place_id"]]["apartment"] = True

    for place in target_location['nearby_hospital']:
        if place["place_id"] not in nearby_dict:
            item_into_dict(nearby_dict, place)
        nearby_dict[place["place_id"]]["hospital"] = True

    for place in target_location['nearby_metro']:
        if place["place_id"] not in nearby_dict:
            item_into_dict(nearby_dict, place)
        nearby_dict[place["place_id"]]["metro"] = True

    places = update_all_places(lat, lng, nearby_dict, categories)

    return list(places.values())


def update_all_places(lat, lng, nearby_dict, categories):

    places = utils.DB_PROCESSED_SPACE.find({'place_id': {'$in': list(nearby_dict.keys())}}, {
        'place_id': 1, 'name': 1, 'geometry': 1, 'rating': 1, 'user_ratings_total': 1, 'foursquare_categories': 1
    })
    seen_ids = set()
    for place in places:
        seen_ids.add(place["place_id"])
        this_location_lat = place["geometry"]["location"]["lat"]
        this_location_lng = place["geometry"]["location"]["lng"]
        name = place["name"]
        rating = place["rating"] if "rating" in place else None
        number_rating = place["user_ratings_total"] if "user_ratings_total" in place else None
        category = None
        similar = False

        if "foursquare_categories" in place and len(place["foursquare_categories"]) > 0:
            category = place["foursquare_categories"][0]["category_name"]
            if category in categories:
                similar = True

        nearby_dict[place['place_id']].update({
            'lat': this_location_lat,
            'lng': this_location_lng,
            'name': name,
            'rating': rating,
            'number_rating': number_rating,
            'category': category,
            'similar': similar
        })

        if nearby_dict[place['place_id']]['distance'] == None:
            nearby_dict[place['place_id']]['distance'] = utils.distance((lat, lng), (this_location_lat, this_location_lng))

    for place_id in nearby_dict.keys():
        if place_id not in seen_ids:
            place = google.details(place_id)
            nearby_dict[place_id].update({
                'lat': place['geometry']['location']['lat'],
                'lng': place['geometry']['location']['lng'],
                'rating': place['rating'] if 'rating' in place else None,
                'number_rating': place['user_ratings_total'] if 'user_ratings_total' in place else None
            })

    return nearby_dict


# update place & provide distance to another place
def _update_place(place_id, lat, lng, categories):
    place = utils.DB_PROCESSED_SPACE.find_one({'place_id': place_id}, {
        'name': 1, 'geometry': 1, 'rating': 1, 'user_ratings_total': 1, 'foursquare_categories': 1
    })
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


# Receives un-processed vectors and generates the match value between them.
# It uses the location as the reference & finds a match with the target
def get_match_value(target, location):

    match_df = pd.DataFrame([target, location]).fillna(0)

    # use other locations as reference to generate match.
    match_df = matching.MATCHING_DF.copy().append(match_df)
    match_df = match_df.drop(columns=["_id", "lat", "lng", "loc_id"])
    match_df = matching.preprocess_match_df(match_df)
    diff_df = match_df.subtract(match_df.iloc[-1])
    diff_df = diff_df.iloc[:-1]
    processed_df = matching.postprocess_match_df(diff_df)
    result_df = matching.weight_and_evaluate(processed_df)

    match_vector = result_df.iloc[-1]
    demo_weight = {
        'income': 4.6,
        'age': 4,
        'education': 3.6,
        'race': 3.6,
        'gender': 3.6
    }
    demo_weight_df = pd.DataFrame([demo_weight])
    # no need to renormalize, as this vector has already been normalized
    match_vector["demo_error"] = match_vector[list(demo_weight.keys())].copy().dot(demo_weight_df.transpose()) / sum(demo_weight.values())

    # High growth (20% over 5 years) considered positive (could alternatively be calculated from EA data)
    growth = True if target["HouseholdGrowth2017-2022-1"] > 20 else False
    demographics = True if matching._map_difference_to_match(match_vector["demo_error"]) > 80 else False
    # High persona or ecosystem match (80%) and above considered positive
    personas = True if matching._map_difference_to_match(match_vector["psycho"]) > 80 else False
    ecosystem = True if matching._map_difference_to_match(match_vector["nearby_categories"]) > 80 else False

    return {
        'match': round(matching._map_difference_to_match(match_vector["error_sum"])),
        'affinities': {
            'growth': growth,
            'demographics': demographics,
            'personas': personas,
            'ecosystem': ecosystem
        }
    }


# Receiving un-processed vectors, generates the top 3 matching psychogrpahics
# Top 3 matching psychographics are currently the highest rated of the most
# similar psychographics
def get_matching_personas(target, location):

    personas_list = matching.SPATIAL_LIST
    target_df = pd.DataFrame([target])
    eval_df = pd.DataFrame([target, location]).fillna(0)
    eval_df = eval_df.subtract(eval_df.iloc[-1]).iloc[:-1][personas_list]

    smallest_10_columns = np.argsort(eval_df.values, axis=1)[0, :10]
    top_10_similar_personas = list(eval_df.columns[smallest_10_columns])

    print(top_10_similar_personas)
    top_10_similar = target_df[top_10_similar_personas]
    print(top_10_similar)
    largest_similar_3_columns = np.argsort(-top_10_similar.values, axis=1)[0, :3]
    print(largest_similar_3_columns)
    top_3_largest_similar_personas = list(top_10_similar.columns[largest_similar_3_columns])
    print(top_3_largest_similar_personas)

    detailed_personas = utils.DB_SPATIAL_TAXONOMY.find({'label': {'$in': top_3_largest_similar_personas}})

    persona_values = dict(target_df.iloc[0][top_3_largest_similar_personas])

    return [{
        "name": persona["label"],
        "percentile": persona_values[persona["label"]],
        "description": persona["sections"]["overview"]["description"],
        "tags": persona["sections"]["topics"]["list"],
    } for persona in detailed_personas]


# combine two dictionaries generated from the "get_demographics" method in order to
# return a dictionary in the form expected from location details
def combine_demographics(my_location, target_location):

    for demographic_category in target_location:
        for sub_category in target_location[demographic_category]:
            sub_category_dict = target_location[demographic_category][sub_category]
            if not isinstance(sub_category_dict, dict):
                continue
            my_value = my_location[demographic_category][sub_category]["value"]
            sub_category_dict["my_location"] = my_value
            sub_category_dict["target_location"] = sub_category_dict.pop("value")

    return target_location


def get_preview_demographics(lat, lng, radius):

    demographics = environics.get_demographics(
        lat, lng, radius, matching.DEMO_DF, matching.BLOCK_DF, matching.DEMO_CATEGORIES)

    median_age = round(demographics["Current Year Median Age"])
    median_income = round(demographics["Current Year Median Household Income"])

    return {
        'median_age': median_age,
        'median_income': median_income
    }


def get_daytimepop(lat, lng, radius):
    arcgis_details = arcgis.details(lat, lng, radius)
    return arcgis_details['DaytimePop']


def get_formatted_arcgisdetails(lat, lng, radius):
    details = arcgis.details(lat, lng, radius)

    details["HouseholdGrowth2017-2022-"] = details.pop("HouseholdGrowth2017-2022")
    details = {
        key + str(radius): value for key, value in details.items()
    }
    return details


def get_categories(place_id):

    space = utils.DB_PROCESSED_SPACE.find_one({'place_id': place_id})

    if not space:
        space = _find_ommitted_place(place_id)

    if 'foursquare_categories' not in space or len(space["foursquare_categories"]) == 0:
        return []

    categories = [category["category_name"] for category in space["foursquare_categories"]]
    return categories


def _find_ommitted_place(place_id):

    print("Finding ommitted space - ", end=" ")
    space = google.details(place_id)
    if not space:
        return None
    name = space['name']
    lat = space['geometry']['location']['lat']
    lng = space['geometry']['location']['lng']
    address = space['formatted_address']

    print(name, "({})".format(place_id))

    # Grab the four square categories for this location if they exist
    foursquare_details = foursquare.find(name, lat, lng, address)
    if foursquare_details:
        foursquare_categories = [{
            'category_name': category['name'],
            'category_short_name': category['shortName'],
            'primary': category['primary']
        } for category in foursquare_details['categories']]
        space['foursquare_categories'] = foursquare_categories

    # TODO: Check if the space has sales data & query pitney if it doesnt
    # space has been detailed and will be updated
    space['detailed'] = True
    try:
        utils.DB_PROCESSED_SPACE.insert_one(space)
    except:
        print("error inserting likely due to duplicate")
        return None

    return space


def get_personas(categories):

    full_categories = utils.DB_CATEGORIES.find({'name': {'$in': categories}})

    if not full_categories:
        return []

    personas = []
    for category in full_categories:
        if 'positive_personas' not in category:
            continue

        personas += category['positive_personas']

    return personas


# return all the categories that are used in the database, organized by occurrence
def get_category_list():
    return [category["name"] for category in list(utils.DB_CATEGORIES.find().sort([('occurrence', -1)]))]


def get_tenant_details(tenant_id):
    """

    Get the details of the tenant and return the matches.

    """

    # # TODO: re-enable - look in the tenant database to get the tenant details.
    tenant = utils.DB_TENANT.find_one({'_id': ObjectId(tenant_id)}, {'tenant_details': 1, 'rep_id': 1})
    if not tenant:
        return None

    details = tenant['tenant_details']
    if 'arcgis_details1' not in details:
        # proxy to determining if we need to check the rep id.
        details = utils.DB_PROCESSED_SPACE.find_one({'_id': tenant_id['rep_id']}, {'_id': 0})
    else:
        return tenant['tenant_details']

    # # TODO: implement case the generates the details when we don't have tenant_id
    # tenant = utils.DB_PROCESSED_SPACE.find_one()
    # return tenant


def get_location_details(location):
    lat = location['lat']
    lng = location['lng']

    space = get_nearest_space(lat, lng, database='vectors')
    vector_id = space["_id"]
    if space:
        space = utils.DB_PROCESSED_SPACE.find_one({'_id': space['loc_id']})
        space["vector_id"] = vector_id
        return space
    else:
        # TODO: get all the details any way and return if there is no space.
        pass


def get_match_value_from_id(tenant_id, vector_id):
    string_id = str(vector_id)
    query = 'match_values.' + string_id
    match_doc = utils.DB_TENANT.find_one({'_id': ObjectId(tenant_id)}, {query: 1})
    return match_doc['match_values'][string_id]


def get_nearest_space(lat, lng, database='spaces'):
    """

    Function that will return the item in the database that is nearest the provided latitude and lngitude.
    Function will first search within block, then within blockgroup. If nothing found, will return None.

    if database is 'spaces', will search the processed spaces. If 'vectors' will search the vectors.

    """

    block = anmspatial.point_to_block(lat, lng, state='CA', prune_leading_zero=False)
    tract = block[:-4]

    query_db = utils.DB_PROCESSED_SPACE if database == 'spaces' else utils.DB_VECTORS_LA

    nearest_spaces = query_db.find({'block': block})
    if nearest_spaces.count() == 0:
        nearest_spaces = query_db.find({'tract': tract})
        if nearest_spaces.count() == 0:
            return None

    closest_space = None
    smallest_distance = 2000

    for space in nearest_spaces:

        eval_lat = space['geometry']['location']['lat'] if database == 'spaces' else space['lat']
        eval_lng = space['geometry']['location']['lat'] if database == 'spaces' else space['lng']

        distance = utils.distance((lat, lng), (eval_lat, eval_lng))

        if distance < smallest_distance:
            smallest_distance = distance
            closest_space = space

    return closest_space


def build_location(address, brand_name=None):

    # first check and return location if in database
    location = google.find(address, name=brand_name, allow_non_establishments=True, save=False)

    if location:
        place = utils.DB_PROCESSED_SPACE.find_one({'place_id': location['place_id']}, {'place_id': 1})
        if place:
            has_demo = 'demo1' in place
            has_psycho = 'psycho1' in place
            has_nearby = 'nearby_complete' in place
            # check if this is a detailed location.
            return (location, str(place['_id'])) if has_demo and has_psycho and has_nearby else (location, None)

        location = google.details(location['place_id'])
        # if not in database, grab the nearest item if it's close enough
        lat = location['geometry']['location']['lat']
        lng = location['geometry']['location']['lng']
        nearest_location = get_nearest_space(lat, lng, database='vectors')
        # if nearby location and it's less than .15 miles away, we should use that.
        if nearest_location and utils.distance((lat, lng), (nearest_location['lat'], nearest_location['lng'])) < 0.15:
            return location, str(nearest_location['loc_id'])

        # if not in database, return location but no details in order for location to be built.
        return location, None
    else:
        # No google location found return None for both options
        return None, None


def update_tenant_details(_id, update):
    try:
        utils.DB_TENANT.update_one({"_id": ObjectId(_id)}, {
            '$set': update
        })
        return True
    except Exception:
        return False


def get_nearby_places(lat, lng, radius=1):

    queries = [
        'store', 'restaurant',  # general categories
        'subway_station',  # transportation
        'hospital',  # key services
        'university',
        'apartments'
    ]

    nearby = {}

    for query in queries:
        nearby_tag = 'nearby_' + query
        if nearby_tag in nearby:
            continue
        if query == 'apartments':
            nearby_places = google.search(
                lat, lng, query, radius=radius)
        else:
            nearby_places = google.nearby(
                lat, lng, query, radius=radius)  # need to add categories
        if not nearby_places:
            continue

        # update the dictionary with this search details
        nearby[nearby_tag] = [{
            'distance': utils.distance(
                (lat, lng),
                (place['geometry']['location']['lat'],
                    place['geometry']['location']['lng'])
            ),
            'place_id': place['place_id'],
            'name': place['name'],
            'types': place['types']
        } for place in nearby_places]

        if query == 'restaurant' or query == 'store':
            for nearby_place in nearby[nearby_tag]:
                details = utils.DB_PROCESSED_SPACE.find_one({
                    "place_id": nearby_place['place_id'],
                    "foursquare_categories.category_name": {'$exists': True}
                }, {
                    "foursquare_categories.catagory_name": 1
                })
                if not details:
                    continue
                nearby_place['foursquare_categories'] = details['foursquare_categories']

    return nearby


def get_environics_demographics(lat, lng):

    demo1 = environics.get_demographics(
        lat, lng, 1, matching.DEMO_DF, matching.BLOCK_DF, matching.DEMO_CATEGORIES)

    demo3 = environics.get_demographics(
        lat, lng, 3, matching.DEMO_DF, matching.BLOCK_DF, matching.DEMO_CATEGORIES)

    return {
        "demo1": demo1,
        "demo3": demo3
    }


def get_spatial_personas(lat, lng):

    psycho1 = spatial.get_psychographics(
        lat, lng, 1, matching.SPATIAL_DF, matching.BLOCK_DF, matching.SPATIAL_CATEGORIES)

    psycho3 = spatial.get_psychographics(
        lat, lng, 3, matching.SPATIAL_DF, matching.BLOCK_DF, matching.SPATIAL_CATEGORIES)

    return {
        "psycho1": psycho1,
        "psycho3": psycho3
    }
