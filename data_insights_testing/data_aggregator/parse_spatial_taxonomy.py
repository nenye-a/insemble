import json
import utils

'''

File to parse and uplaod spatial data to database

'''


def parse_taxonomy():

    with open('raw_data/Taxonomy Metadata.json') as f:
        spatial_taxonomy = json.load(f)

    utils.unique_db_index(utils.DB_SPATIAL_TAXONOMY, "label")
    utils.DB_SPATIAL_TAXONOMY.insert_many(list(spatial_taxonomy.values()))


if __name__ == "__main__":
    parse_taxonomy()
