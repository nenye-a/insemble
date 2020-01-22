import geopy.distance

'''

Utility methods that are used to make the overall dataset building more
efficient & powerful

'''

MILES_TO_METERS_FACTOR = 1609.34


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
