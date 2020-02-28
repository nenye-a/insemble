import pandas
import json
import utils
from fuzzywuzzy import fuzz
from fuzzywuzzy import process as fuzz_process

'''

File to parse and uplaod spatial data to database

'''

utils.db_index(utils.DB_CATEGORIES, 'name', unique=True)


def parse_taxonomy():

    with open('raw_data/Taxonomy Metadata.json') as f:
        spatial_taxonomy = json.load(f)

    utils.db_index(utils.DB_SPATIAL_TAXONOMY, "label", unique=True)
    utils.DB_SPATIAL_TAXONOMY.insert_many(list(spatial_taxonomy.values()))


def parse_taxonomy_csv():

    # with open('raw_data/Taxonomy Metadata.csv') as f:
    taxonomy = utils.read_dataframe_csv('raw_data/Taxonomy Metadata.csv', is_zipped=False)
    taxonomy_dict = taxonomy.to_dict(orient='records')
    for item in taxonomy_dict:
        utils.DB_SPATIAL_TAXONOMY.update_one({"label": item["label"]}, {'$set': {
            "photo": item["image_link"]
        }})


def orient_categories_to_personas_exact():

    foursquare_categories = utils.DB_FOURSQUARE.find_one({"name": "foursquare_categories"})["foursquare_categories"]
    category_bank = set([category.lower() for category in foursquare_categories])

    spatial_taxonomy = utils.DB_SPATIAL_TAXONOMY.find()

    categories = {}  # dictionary will hold all the categories

    for spatial_category in spatial_taxonomy:

        positive_categories = spatial_category["sections"]["commerce"]["pois"]["positive"]
        negative_categories = spatial_category["sections"]["commerce"]["pois"]["negative"]

        for category in positive_categories:
            if category.lower() not in category_bank:
                continue
            if category not in categories:
                categories[category] = {"name": category}
            categories[category]["positive_personas"] = categories[category].get("positive_personas", []) + [spatial_category["label"]]

        for category in negative_categories:
            if category.lower() not in category_bank:
                continue
            if category not in categories:
                categories[category] = {"name": category}
            categories[category]["negative_personas"] = categories[category].get("negative_personas", []) + [spatial_category["label"]]


def orient_categories_to_personas_fuzzy():

    foursquare_categories = utils.DB_FOURSQUARE.find_one({"name": "foursquare_categories"})["foursquare_categories"]
    category_bank = [category.lower() for category in foursquare_categories]
    spatial_taxonomy = utils.DB_SPATIAL_TAXONOMY.find()

    categories = {}

    for spatial_category in spatial_taxonomy:

        positive_categories = spatial_category["sections"]["commerce"]["pois"]["positive"]
        negative_categories = spatial_category["sections"]["commerce"]["pois"]["negative"]

        for category in positive_categories:
            matched_category = fuzz_process.extractOne(category.lower(), category_bank, score_cutoff=74)
            if not matched_category:
                continue

            matched_category = fuzz_process.extractOne(matched_category[0], foursquare_categories)[0]
            if matched_category not in categories:
                categories[matched_category] = {"name": matched_category}
            categories[matched_category]["positive_personas"] = categories[matched_category].get(
                "positive_personas", []) + [spatial_category["label"]]

        for category in negative_categories:
            matched_category = fuzz_process.extractOne(category.lower(), category_bank, score_cutoff=74)
            if not matched_category:
                continue

            matched_category = fuzz_process.extractOne(matched_category[0], foursquare_categories)[0]
            if matched_category not in categories:
                categories[matched_category] = {"name": matched_category}
            categories[matched_category]["negative_personas"] = categories[matched_category].get(
                "negative_personas", []) + [spatial_category["label"]]

    for category in categories.values():
        utils.DB_CATEGORIES.update_one({'name': category["name"]}, {'$set': category}, upsert=True)


if __name__ == "__main__":
    parse_taxonomy_csv()
    # orient_categories_to_personas_fuzzy()
