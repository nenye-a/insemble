import pandas as pd
import sys
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, 'data_aggregator'))
import utils

raw_foursquare_categories = open('foursquare_categories.txt').readlines()
processed_categories = []
for category in raw_foursquare_categories:
    is_digit = category[0].isdigit()
    has_incorrect_strings = "icon" in category or "Supported countries" in category
    if not (is_digit or has_incorrect_strings):
        processed_categories.append(category[:-1])

FOURSQUARE_CATEGORIES = processed_categories


def process(limit):

    # Obtain all the spaces from the processed database
    spaces = utils.DB_PROCESSED_SPACE.find({
        'nearby_store': {'$exists': True},
        'nearby_restaurant': {'$exists': True}
    }).limit(limit)
    spaces_list = list(spaces)

    # flatten all internal dictionaries for easy parsing
    flattened_dataframe = pd.DataFrame(pd.json_normalize(
        spaces_list
    ))

    # initialize the target_dataframe
    result_dataframe = pd.DataFrame()

    # get latitude & longitude
    result_dataframe["lat"] = flattened_dataframe["geometry.location.lat"]
    result_dataframe["lng"] = flattened_dataframe["geometry.location.lng"]

    # get demographics
    # First item as reference for field names
    demo_fields = spaces_list[0]["demo1"]
    for field in demo_fields:
        field_query1 = "demo1." + field
        field_query3 = "demo3." + field
        if isinstance(demo_fields[field], dict):
            for sub_field in demo_fields[field]:
                sub_field_query1 = field_query1 + "." + sub_field
                sub_field_query3 = field_query3 + "." + sub_field
                result_dataframe[sub_field] = flattened_dataframe[sub_field_query1]
                result_dataframe[sub_field +
                                 "3"] = flattened_dataframe[sub_field_query3]
        else:
            result_dataframe[field] = flattened_dataframe[field_query1]
            result_dataframe[field + "3"] = flattened_dataframe[field_query3]

    # get psychographics
    # First item as refernece for field names
    psycho_fields = spaces_list[0]["psycho1"]
    for field in psycho_fields:
        field_query1 = "psycho1." + field
        field_query3 = "psycho3." + field
        if isinstance(psycho_fields[field], dict):
            for sub_field in psycho_fields[field]:
                sub_field_query1 = field_query1 + "." + sub_field
                sub_field_query3 = field_query3 + "." + sub_field
                result_dataframe[sub_field] = flattened_dataframe[sub_field_query1]
                result_dataframe[sub_field +
                                 "3"] = flattened_dataframe[sub_field_query3]
        else:
            result_dataframe[field] = flattened_dataframe[field_query1]
            result_dataframe[field + "3"] = flattened_dataframe[field_query3]

    # get arcgis details
    # First item as refernece for field names
    arcgis_fields = spaces_list[0]["arcgis_details1"]
    for field in arcgis_fields:
        field_query1 = "arcgis_details1." + field
        field_query3 = "arcgis_details3." + \
            field[:-1] + "3"  # replace trialing 1 with 3
        result_dataframe[field] = flattened_dataframe[field_query1]
        result_dataframe[field + "3"] = flattened_dataframe[field_query3]

    # get ratings and the number of ratings
    result_dataframe["user_ratings_total"] = flattened_dataframe["user_ratings_total"]
    result_dataframe["google_star_rating"] = flattened_dataframe["rating"]

    # record the id
    result_dataframe["loc_id"] = flattened_dataframe["_id"]

    result_dataframe = result_dataframe.dropna()
    # print(list(flattened_dataframe.columns))

    # TODO: factor in distance
    count = 0 
    for category in FOURSQUARE_CATEGORIES:

        def add_categories(nearby_list):
            my_sum = 0
            for store in nearby_list:
                if 'foursquare_categories' in store and len(store['foursquare_categories']) > 0:
                    if store['foursquare_categories'][0]['category_name'] == category:
                        my_sum += 1
            return my_sum

        filtered_store_columns = flattened_dataframe["nearby_store"].apply(
            add_categories)
        result_dataframe[category] = filtered_store_columns
        filtered_restaurant_columns = flattened_dataframe["nearby_restaurant"].apply(
            add_categories)
        result_dataframe[category] = filtered_restaurant_columns

        count += 1
        print("{} more category update out of {}".format(count, len(FOURSQUARE_CATEGORIES)))


    return result_dataframe


if __name__ == "__main__":
    
    data_frame = process(130000)

    # insert into database
    data = data_frame.to_dict(orient='records')
    utils.DB_VECTORS_LA.insert_many(data)