
import math
import gzip
import pandas as pd
import geopy.distance
from mongo_connect import Connect
from data.api import anmspatial


'''

Utility methods & fields that are used to make the overall dataset building more
efficient & powerful

'''

# regular statics
MILES_TO_METERS_FACTOR = 1609.34
EARTHS_RADIUS_MILES = 3958.8

# Database connections
client = Connect.get_connection()

# DATABASE CONNECTIONS
client = Connect.get_connection()  # client, MongoDB connection

# top level database connections
DB_SPACE = client.spaceData  # database for legacy spatial information
DB_APP_LEGACY = client.appMatchData  # legacy app database
DB_APP = client.appData  # hosts the main data for the application
DB_REQUESTS = client.requests  # database the hosts requests saved by safe_request

# collection connections - categories
DB_FOURSQUARE = DB_SPACE.foursquare_categories
DB_SPATIAL_TAXONOMY = DB_SPACE.spatial_taxonomy
DB_CATEGORIES = DB_SPACE.categories

# collection connections - scraping
DB_AGGREGATE = DB_SPACE.aggregate_records
DB_COLLECT = DB_SPACE.collect_records

# collection connections - application support
DB_BRANDS = DB_APP.brands
DB_PLACES = DB_APP.places
DB_LOCATIONS = DB_APP.locations
DB_LOCATION_MATCHES = DB_APP.location_matches
DB_PROPERTY = DB_APP.properties
DB_BRAND_SPACE = DB_APP.brand_space_matches
DB_REGIONS = DB_APP.regions

# collection connections - matching
DB_VECTORS = DB_SPACE.preprocessed_vectors
DB_VECTORS_LA = DB_SPACE.LA_space_vectors

# legacy databaces - pending deletion
DB_TENANT = DB_APP_LEGACY.tenant_details
DB_PROPERTY_LEGACY = DB_APP_LEGACY.property_details
DB_ZIP_CODES = DB_SPACE.zip_codes
DB_PROCESSED_SPACE = DB_SPACE.spaces
DB_OLD_SPACES = DB_SPACE.dataset2
DB_SPATIAL_CATS = DB_SPACE.spatial_categories
DB_DEMOGRAPHIC_CATS = DB_SPACE.demographic_categories


# simple unique index of a pymongo database collection
def db_index(collection, *indices, unique=False):
    index_request = []
    for index in indices:
        index_request.append((index, 1))
    collection.create_index(index_request, unique=unique)


# from a list of items in text form
def get_column_from_txt(file_name):
    f = open(file_name, 'r')
    # items should be organized in a list with each seperated by \n
    items = f.readlines()
    items = [item[:-1] for item in items]
    return items

# return the difference between two lists


def list_diff(list1, list2):
    diff = list1.difference(list2)
    return ','.join(list(diff))


# flattens a list of lists
def flatten(l):
    return [item for sublist in l for item in sublist]


# provided two lat & lng tuples, function returns distance in miles:
# geo = (lat, lng)
def distance(geo1, geo2):
    mile_distance = geopy.distance.distance(geo1, geo2).miles
    return mile_distance


# provided two lat & lng tuples, funciton returns the bearing
# between them
def bearing(geo1, geo2):
    # turn tuples that are made of degrees to tuples of radians
    def to_radians(item): return (math.radians(item[0]), math.radians(item[1]))

    lat1, lng1 = to_radians(geo1)
    lat2, lng2 = to_radians(geo2)

    y = math.sin(lng2 - lng1) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * \
        math.cos(lat2) * math.cos(lng2 - lng1)
    bearing = math.atan2(y, x)

    return math.degrees(bearing)


def meters_to_miles(meters):
    return meters / MILES_TO_METERS_FACTOR


def miles_to_meters(miles):
    return miles * MILES_TO_METERS_FACTOR


# retrieves csv from file_system. If no file_system specified,
# assumes the file is locally hosted.
def read_dataframe_csv(path, file_system=None, is_zipped=True):
    if file_system:
        def f_open(file_path): return file_system.open(file_path, 'rb')
    else:
        def f_open(file_path): return open(file_path, 'rb')

    with f_open(path) as f:
        unzipped_file = gzip.GzipFile(fileobj=f) if is_zipped else f
        dataframe = pd.read_csv(unzipped_file)
        dataframe.pop("Unnamed: 0") if "Unnamed: 0" in dataframe else None
        return dataframe


def test_spaces_batched(file_name, query={}, new=True, batch_size=2000):
    spaces = DB_PROCESSED_SPACE.find(query)
    len_spaces = spaces.count()
    items = []
    count = 1
    for space in spaces:
        items.append((
            space['name'],
            space['geometry']['location']['lat'],
            space['geometry']['location']['lng']
        ))
        if count % batch_size == 0:
            items_df = pd.DataFrame(items)
            items_df.to_csv(file_name.split(',')[0] + str(count) + '.csv')
            items = []

        count += 1
        if count == len_spaces:
            items_df = pd.DataFrame(items)
            items_df.to_csv(file_name.split(',')[0] + str(count) + '.csv')
            items = []


def test_spaces(file_name, query={}):
    spaces = DB_PROCESSED_SPACE.find(query)
    len_spaces = spaces.count()
    items = []
    for space in spaces:
        items.append((
            space['name'],
            space['geometry']['location']['lat'],
            space['geometry']['location']['lng']
        ))
    items_df = pd.DataFrame(items)
    items_df.to_csv(file_name.split(',')[0] + str(len_spaces) + '.csv')


def test_old_spaces(file_name, query={}):
    spaces = DB_OLD_SPACES.find(query)
    len_spaces = spaces.count()
    items = []
    count = 1
    for space in spaces:
        items.append((
            space['name'],
            space['lat'],
            space['lng']
        ))
        if count % 2000 == 0:
            items_df = pd.DataFrame(items)
            items_df.to_csv(file_name.split(',')[0] + str(count) + '.csv')
            items = []
        count += 1
        if count == len_spaces:
            items_df = pd.DataFrame(items)
            items_df.to_csv(file_name.split(',')[0] + str(count) + '.csv')
            items = []


def observe_collector(file_name, run_name):
    run_record = DB_COLLECT.find_one({'run_name': run_name})
    items = []
    for call in run_record['calls']:
        items.insert(0, (call['lat'], call['lng']))
    items_df = pd.DataFrame(items)
    items_df.to_csv(file_name)


# Translates value from one range to another
def translate(value, left_min, left_max, right_min, right_max):

    left_span = left_max - left_min
    right_span = right_max - right_min
    value_scaled = float(value - left_min) / float(left_span)
    return right_min + (value_scaled * right_span)

# Provided your current latitude, current longitude, a desired distance
# can determine the latitude and longitude of a point at the distance
# and in the direction provided. Direction provided in degrees. Distance
# in miles


def location_at_distance(current_lat, current_lng, distance, degrees):

    # all important details converted to radians
    current_lat = math.radians(current_lat)
    current_lng = math.radians(current_lng)
    bearing = math.radians(degrees)

    next_lat = math.asin(math.sin(current_lat) * math.cos(distance / EARTHS_RADIUS_MILES) +
                         math.cos(current_lat) * math.sin(distance / EARTHS_RADIUS_MILES) * math.cos(bearing))

    next_lng = current_lng + math.atan2(math.sin(bearing) * math.sin(distance / EARTHS_RADIUS_MILES) * math.cos(
        current_lat), math.cos(distance / EARTHS_RADIUS_MILES) - math.sin(current_lat) * math.sin(next_lat))

    next_lat = math.degrees(next_lat)
    next_lng = math.degrees(next_lng)

    return (next_lat, next_lng)


# Provided a latitude, longitude, and radius, this function will return
# all block groups that intersect the circle. This method will roughly
# estimate block group interseciton recursively through reduced radius circles.
# Currently method of choice opts to risk gaps in data due to block group
# size. Radius is provided in miles
# FIXME: This algorithm never congerges, and alternative method has been created
def intersecting_block_groups(lat, lng, radius, state=None):

    # Create function depending on state or not.
    if state:
        def get_block_group(
            x, y): return anmspatial.point_to_block_group(x, y, state)
    else:
        def get_block_group(
            x, y): return anmspatial.point_to_block_group(x, y)

    # Current algorithm splits circle into 7 circles (6 circuling around a
    # central circle of smaller radius). Algorithm, then recurses on each until
    # blockgroup is found
    bearings = [0, 60, 120, 180, 240, 300]
    search_points = [location_at_distance(
        lat, lng, radius, bearing) for bearing in bearings] + [(lat, lng)]

    print(search_points)

    block_groups = [get_block_group(point_lat, point_lng)
                    for point_lat, point_lng in search_points]

    if len(set(block_groups)) == 1:
        # all block groups are the same, circle is fully within a block group
        print("base case ret", list(set(block_groups)))
        return list(set(block_groups))

    sub_circle_distance = float(radius) * 2 / 3
    sub_circle_radius = float(radius) / 3
    sub_circle_points = [location_at_distance(
        lat, lng, sub_circle_distance, bearing) for bearing in bearings] + [(lat, lng)]

    unflat_block_groups = [intersecting_block_groups(
        point_lat, point_lng, sub_circle_radius, state) for point_lat, point_lng in sub_circle_points]

    ret = flatten(unflat_block_groups)
    ret = list(set(ret))
    print("ret", ret)
    return ret


def is_number(num):
    try:
        float(num)
        return True
    except ValueError:
        return False


def add_dictionary_values(dictionary, values):
    """
    Helper function to add up all the values in a dictionary given the dictionary and
    all the index of the values that we would want to sum up.
    """

    sum_items = [dictionary[value] for value in values]
    return sum(sum_items)


def growth(current, future):
    """
    Calculate growth value in percentage between one number and an other.
    """
    return 100 * float(future - current) / current


def in_range(num, target_range):
    """
    Provided a number and a list indicating a range, returns if the number is in the range
    """
    if num >= target_range[0] and num <= target_range[1]:
        return True
    return False


def list_matches_condition(bool_func, eval_list):
    """
    Provided a function and a list, will return True if atleast one of the items in the list meets the
    condition specified by the function
    """
    for item in eval_list:
        if bool_func(item):
            return True
    return False


def round_dictionary(dictionary):
    """
    Rounds a dictrionary of numbers. This will round infinitely deep dictrionaries as long
    as they are entirely numerical. Though it modifies the data inplace, it will still return
    the pointer to the object for ease.
    """
    for item in dictionary:
        if isinstance(dictionary[item], dict):
            round_dictionary(dictionary[item])
        print(item)
        dictionary[item] = round(dictionary[item])

    return dictionary


if __name__ == "__main__":

    def test_location_at_distance():
        target_distance = 1.5
        lat = 34.056186
        lng = -118.276942
        next_location = location_at_distance(lat, lng, target_distance, 90)
        actual_distance = distance((lat, lng), next_location)
        actual_bearing = bearing((lat, lng), next_location)

        print(next_location)

        print("Actual distance: {}".format(actual_distance))
        print("Actual bearing: {}".format(actual_bearing))

    def test_intersecting_block_groups():
        lat = 34.056186
        lng = -118.276942
        print(intersecting_block_groups(lat, lng, .02275, 'CA'))

    def test_get_sics():
        filename = 'pitney_sics.txt'
        sics = get_column_from_txt(filename)
        print(sics)

    def test_get_types():
        filename = 'types.txt'
        types = get_column_from_txt(filename)
        print(types)
