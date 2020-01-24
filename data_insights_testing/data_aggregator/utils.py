import sys
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)  # include data_insights_testing in path
from mongo_connect import Connect
import anmspatial
import math
import geopy.distance


'''

Utility methods & fields that are used to make the overall dataset building more
efficient & powerful

'''

MILES_TO_METERS_FACTOR = 1609.34
EARTHS_RADIUS_MILES = 3958.8
DB_SPACE = Connect.get_connection().spaceData
DB_REQUESTS = Connect.get_connection().requests
DB_AGGREGATE = DB_SPACE.aggregate_records
DB_SICS = DB_SPACE.sics
DB_RAW_SPACE = DB_SPACE.raw_spaces


# simple unique index of a pymongo database collection
def unique_db_index(collection, *indices):
    index_request = []
    for index in indices:
        index_request.append((index, 1))
    collection.create_index(index_request, unique=True)


# from a list of sics in text form, get sics
def get_sics_from_txt(file_name):
    f = open(file_name, 'r')
    sics = f.readlines()
    sics = [sic[:4] for sic in sics]
    return sics


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
    # calculate if item is beyond a certain distance
    mile_distance = geopy.distance.distance(geo1, geo2).miles
    return mile_distance


def meters_to_miles(meters):
    return meters/MILES_TO_METERS_FACTOR


def miles_to_meters(miles):
    return miles*MILES_TO_METERS_FACTOR


# Provided your current latitude, current longitude, a desired distance
# can determine the latitude and longitude of a point at the distance
# and in the direction provided. Direction provided in degrees. Distance
# in miles
def location_at_distance(current_lat, current_lng, distance, degrees):

    # all important details converted to radians
    current_lat = math.radians(current_lat)
    current_lng = math.radians(current_lng)
    bearing = math.radians(degrees)

    next_lat = math.asin(math.sin(current_lat)*math.cos(distance/EARTHS_RADIUS_MILES) +
                         math.cos(current_lat)*math.sin(distance/EARTHS_RADIUS_MILES)*math.cos(bearing))

    next_lng = current_lng + math.atan2(math.sin(bearing)*math.sin(distance/EARTHS_RADIUS_MILES)*math.cos(
        current_lat), math.cos(distance/EARTHS_RADIUS_MILES)-math.sin(current_lat)*math.sin(next_lat))

    next_lat = math.degrees(next_lat)
    next_lng = math.degrees(next_lng)

    return (next_lat, next_lng)


# Provided a latitude, longitude, and radius, this function will return
# all block groups that intersect the circle. This method will roughly
# estimate block group interseciton recursively through reduced radius circles.
# Currently method of choice opts to risk gaps in data due to block group
# size. Radius is provided in miles
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

    sub_circle_distance = float(radius)*2/3
    sub_circle_radius = float(radius)/3
    sub_circle_points = [location_at_distance(
        lat, lng, sub_circle_distance, bearing) for bearing in bearings] + [(lat, lng)]

    unflat_block_groups = [intersecting_block_groups(
        point_lat, point_lng, sub_circle_radius, state) for point_lat, point_lng in sub_circle_points]

    ret = flatten(unflat_block_groups)
    ret = list(set(ret))
    print("ret", ret)
    return ret

if __name__ == "__main__":

    def test_location_at_distance():
        target_distance = 1.5
        lat = 34.056186
        lng = -118.276942
        next_location = location_at_distance(lat, lng, target_distance, 11)
        actual_distance = distance((lat, lng), next_location)

        print(actual_distance)
        print(next_location)

    def test_intersecting_block_groups():
        lat = 34.056186
        lng = -118.276942
        print(intersecting_block_groups(lat, lng, .02275, 'CA'))

    def test_get_sics():
        filename = 'pitney_sics.txt'
        get_sics_from_txt(filename)

   
#    test_intersecting_block_groups()
    print(intersecting_block_groups(18.0809736,-67.0851964,0.000001))
    # sics = get_sics_from_txt('pitney_sics.txt')
    # DB_SICS.insert({
    #     'name': 'sic_code_list',
    #     'sics': sics
    # })
