from utils import DB_AGGREGATE, DB_COLLECT, DB_SICS, DB_TYPES, DB_RAW_SPACE, DB_PROCESSED_SPACE, unique_db_index
import utils
import goog
import pitney
import foursquare
import random
import spatial
import arcgis
import environics
import pprint


y_lat, y_lng = 34.032401, -118.272874
t_lat, t_lng = 34.030759, -118.372727


def get_arcgis_demo(lat, lng):
    arcgis_details1 = arcgis.details(lat, lng, 3)
    print("Arcgis: {}".format(arcgis_details1))

    cats, demo_df = environics.create_demo_cats_and_df()
    block_df = spatial.create_block_grp_df()

    demo_dict3 = environics.get_demographics(lat, lng, 3)
    print("Demo details")
    pprint.pprint(demo_dict3)


def get_spatial(lat, lng):

    cats, spatial_df = spatial.create_spatial_cats_and_df()
    block_df = spatial.create_block_grp_df()

    psycho_dict1 = spatial.get_psychographics(
        lat, lng, 1, spatial_df, block_df, cats)

    print("Personas:")
    pprint.pprint(psycho_dict1)


def get_proximity(lat, lng):

    type_queries = [
        'store', 'restaurant',  # general categories
        'park',  # key entertainment
        'subway_station',  # transportation
        'hospital',  # key services
        'church',  # key religion
        'university',
    ]

    # Types that cannot be queried as a type from google, but can be searched
    search_queries = ['apartments']

    all_queries = type_queries + search_queries

    pass


if __name__ == "__main__":
    get_arcgis_demo(t_lat, t_lng)
    # get_spatial(t_lat, t_lng)
