import geopy.distance
import math
from mongo_connect import Connect


'''

Utility methods & fields that are used to make the overall dataset building more
efficient & powerful

'''

# regular statics
MILES_TO_METERS_FACTOR = 1609.34
EARTHS_RADIUS_MILES = 3958.8

# Database connections
DB_SPACE = Connect.get_connection().spaceData
DB_REQUESTS = Connect.get_connection().requests
DB_PROCESSED = DB_SPACE.spaces
DB_OLD_SPACES = DB_SPACE.dataset2
DB_VECTORS = DB_SPACE.preprocessed_vectors


# simple unique index of a pymongo database collection
def unique_db_index(collection, *indices):
    index_request = []
    for index in indices:
        index_request.append((index, 1))
    collection.create_index(index_request, unique=True)


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
        math.cos(lat2)*math.cos(lng2 - lng1)
    bearing = math.atan2(y, x)

    return math.degrees(bearing)


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
