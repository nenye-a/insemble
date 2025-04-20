import utils
import time

'''

This file will generate average demographic and psychographic informaiton for each brand.

'''


def grab_photos(brand_id):
    '''
    Provided a brand_id, will grab all the places that are associated with the brand,
    and generate an average demographic and psychographic.
    '''

    # grab all the locations associated with the brand
    photos_list = [place['photos'] for place in utils.DB_PLACES.find({'brand_id': brand_id}, {'photos': 1})]


def average_arcgis(brand_id):
    '''
    Provided a brand_id, will grab all the places that are associated with the brand,
    and geneate average arcgis_details
    '''

    # grab all the locations associated with the brand
    location_id_list = [place['location_id'] for place in utils.DB_PLACES.find({'brand_id': brand_id}, {'location_id': 1})]
    locations_list = utils.DB_LOCATIONS.find({'_id': {'$in': location_id_list}})

    locations_list = list(locations_list)
    average_arcgis_demographics = average_dictionary_list([location["arcgis_demographics"] for location in locations_list])

    return {
        'average_arcgis_demographics': average_arcgis_demographics
    }


def average_dictionary_list(dictionary_list):
    """
    Given a list of dictionaries that all have the same key, index pairs, will provide a master dictionary
    with the average of all the items within the dictrionary
    """

    if len(dictionary_list) == 0:
        return None
    average_dictionary = {}

    # look for representative item
    rep_item = None
    for item in dictionary_list:
        rep_item = item
        if rep_item:
            break

    if not rep_item:
        return None

    for item in rep_item:

        type_rep_item = rep_item[item]
        if not type_rep_item:
            for dict_item in dictionary_list:
                if dict_item and dict_item[item]:
                    type_rep_item = dict_item[item]
                    break
        if not type_rep_item:
            average_dictionary[item] = None
            continue

        if isinstance(type_rep_item, dict):
            average_dictionary[item] = average_dictionary_list([dictionary[item] for dictionary in dictionary_list if dictionary])
            continue
        items_to_sum = [dictionary[item] for dictionary in dictionary_list if dictionary and dictionary[item] and dictionary[item] != 0]
        if len(items_to_sum) == 0:
            average_dictionary[item] = None
            continue
        try:
            average_dictionary[item] = round(sum(items_to_sum) / len(items_to_sum), 2)
        except Exception:
            raise

    return average_dictionary


if __name__ == "__main__":

    """
    For all the brands, update the average_demographics and psychographics
    """

    data_base_query = {'average_arcgis_demographics': {}}
    pre_sample = {'size': 3000}
    batch_size = {'size': 100}
    projection = {'_id': 1}

    while True:

        batch_start = time.time()

        brands = utils.DB_BRANDS.aggregate([
            {'$sample': pre_sample},
            {'$match': data_base_query},
            {'$sample': batch_size},
            {'$project': projection}
        ])

        # brands = utils.DB_BRANDS.find({"typical_squarefoot": {'$ne': []}, 'average_arcgis_demographics': {}}, {'_id': 1})

        for brand in brands:
            utils.DB_BRANDS.update({'_id': brand['_id']}, {'$set': average_arcgis(brand['_id'])})
            print("** Brand Demo: Brand {} updated with demographics and psychographics.".format(brand["_id"]))

        batch_finish = time.time()

        print("Batch Complete - Elapsed Time in seconds: {}".format(batch_finish - batch_start))
