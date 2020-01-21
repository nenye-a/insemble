import geopy.distance

'''

Utility methods that can be used to make the overall dataset building more
efficient & powerful

'''


# provided two lat & lng tuples, function returns distance in miles:
# geo = (lat, lng)
def distance(geo1, geo2):
    # calculate if item is beyond a certain distance
    mile_distance = geopy.distance.distance(geo1, geo2).miles
    return mile_distance
