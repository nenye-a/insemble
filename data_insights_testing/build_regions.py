import sys
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, 'data_aggregator'))
import utils
import new_matching


demo_categories = new_matching.DEMO_CATEGORIES
spatial_categories = new_matching.SPATIAL_CATEGORIES

# indempotently create index
# utils.DB_REGIONS.create_index([("name", 1)], unique=True)
# utils.DB_REGIONS.create_index([("location", "2dsphere")])
# utils.DB_REGIONS.create_index([("geometry", "2dsphere")])


def insert_block_group(block_df):
    """
    Provided a dataframe of lat, lng, and block_grp, insert
    blockgroup into our database.
    """

    blockgroups = block_df.to_dict(orient='records')
    for block in blockgroups:
        block['name'] = str(block.pop('block_grp'))
        if len(block['name']) == 11:
            block['name'] = '0' + block["name"]  # put in full block names only
        block['type'] = "blockgroup"
        block["location"] = {
            'type': "Point",
            'coordinates': [round(block.pop('lng'), 6), round(block.pop('lat'), 6)]
        }

    # print(blockgroups)
    utils.DB_REGIONS.insert_many(blockgroups)


def find_blocks(lat, lng, radius):
    near_locations = utils.DB_REGIONS.find({'type': 'blockgroup', 'location': {
        '$near': {
            '$geometry': {
                'type': "Point",
                'coordinates': [lng, lat]
            },
            '$maxDistance': utils.miles_to_meters(radius)
        }
    }})

    for locations in near_locations:
        coordinates = locations["location"]["coordinates"]
        coordinates = (coordinates[1], coordinates[0])
        print(utils.distance((lat, lng), coordinates))
        print(locations["name"])


def insert_environics_data(demo_df):
    """
    Provided a demographic dataframe that links blockgroups
    to environics data, insert data into datbase. NOTE:
    Items have to be ordered correctly!!! Refer to
    "Demo Categories" in mongoDB database for correct ordering
    """

    missing_blocks = []

    for item in demo_df.columns:
        update = {'evironics_demographics': parse_environics_row(demo_df[item])}
        name = str(item)
        name = '0' + name if len(name) == 11 else name
        print(name)
        try:
            utils.DB_REGIONS.update({'type': 'blockgroup', 'name': name}, {'$set': update})
        except Exception:
            missing_blocks.append(name)

    print("\nThese Blocks are Missing [ - {} - ]\n".format(missing_blocks))

    # pprint.pprint(parse_environics_row(demo_df[item]))


def parse_environics_row(demo_series):

    ea_demographics = {}
    ea_demographics["Current Year Population, Gender"] = dict(zip(demo_categories[0:2], demo_series[0:2]))
    ea_demographics["Current Year Population, Race"] = dict(zip(demo_categories[2:26], demo_series[2:26]))
    ea_demographics["Current Year Population, Age"] = dict(zip(demo_categories[26:37], demo_series[26:37]))
    ea_demographics["Current Year Median Age"] = demo_series[37]
    ea_demographics["Current Year Average Age"] = demo_series[38]
    ea_demographics["Current Year Population 15+, Marital Status"] = dict(
        zip(demo_categories[39:51], demo_series[39:51]))
    ea_demographics["Current Year Family Households"] = dict(zip(demo_categories[51:57], demo_series[51:57]))
    ea_demographics["Current Year Households, Household Income"] = dict(
        zip(demo_categories[57:69], demo_series[57:69]))
    ea_demographics["Current Year Median Household Income"] = demo_series[69]
    ea_demographics["Current Year Average Household Income"] = demo_series[70]
    ea_demographics["Current Year Households, Effective Buying Income"] = dict(
        zip(demo_categories[71:83], demo_series[71:83]))
    ea_demographics["Current Year Median Household Effective Buying Income"] = demo_series[83]
    ea_demographics["Current Year Average Household Effective Buying Income"] = demo_series[84]
    ea_demographics["Current Year Aggregate Household Effective Buying Income"] = demo_series[85]
    ea_demographics["Current Year Population 25+, Education"] = dict(
        zip(demo_categories[86:94], demo_series[86:94]))
    ea_demographics["Current Year Workers, Transportation to Work"] = dict(
        zip(demo_categories[94:100], demo_series[94:100]))
    ea_demographics["Current Year Workers, Travel Time To Work"] = dict(
        zip(demo_categories[100:103], demo_series[100:103]))
    ea_demographics["Five Year Population, Gender"] = dict(
        zip(demo_categories[103:105], demo_series[103:105]))
    ea_demographics["Five Year Population, Age"] = dict(zip(demo_categories[105:116], demo_series[105:116]))
    ea_demographics["Five Year Households, Household Income"] = dict(
        zip(demo_categories[116:128], demo_series[116:128]))
    ea_demographics["Five Year Median Household Income"] = demo_series[128]
    ea_demographics["Five Year Average Household Income"] = demo_series[129]
    ea_demographics["Five Year Households, Effective Buying Income"] = dict(
        zip(demo_categories[130:142], demo_series[130:142]))
    ea_demographics["Five Year Median Household Effective Buying Income"] = demo_series[142]
    ea_demographics["Five Year Average Household Effective Buying Income"] = demo_series[143]
    ea_demographics["Five Year Aggregate Household Effective Buying Income"] = demo_series[144]

    return ea_demographics


def insert_spatial_data(spatial_df):
    """
    Provided a psychographic dataframe that links blockgroups
    to environics data, insert data into datbase. NOTE:
    Items have to be ordered correctly!!! Refer to
    "Spatial Categories" in mongoDB database for correct ordering
    """

    # print(spatial_df)
    missing_blocks = []
    categories = spatial_categories + ['volume_percentile']

    for item in spatial_df.columns:
        update = {'spatial_psychographics': dict(zip(categories, list(spatial_df[item])))}
        name = str(item)
        name = '0' + name if len(name) == 11 else name
        print(name)
        try:
            utils.DB_REGIONS.update({'type': 'blockgroup', 'name': name}, {'$set': update})
        except Exception:
            missing_blocks.append(name)
            print("{} is missing!".format(name))

    print("\nThese Blocks are Missing [ - {} - ]\n".format(missing_blocks))


if __name__ == "__main__":
    # print(demo_df)
    # print(block_df)
    # insert_block_group()
    # find_blocks(34, -118, 5)
    # insert_environics_data()
    # insert_spatial_data()

    pass
