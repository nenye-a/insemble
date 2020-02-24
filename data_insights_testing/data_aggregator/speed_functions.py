import utils
import anmspatial

'''

Temporary file for functions used to speed up the database detaills.

'''


def get_nearest_space(lat, lng, database='spaces'):
    """

    Function that will return the item in the database that is nearest the provided latitude and lngitude.
    Function will first search within block, then within blockgroup. If nothing found, will return None.

    if database is 'spaces', will search the processed spaces. If 'vectors' will search the vectors.

    """

    block = anmspatial.point_to_block(lat, lng, state='CA', prune_leading_zero=False)
    blockgroup = block[:-3]

    query_db = utils.DB_PROCESSED_SPACE if database == 'spaces' else utils.DB_VECTORS_LA

    nearest_spaces = query_db.find({'block': block})
    if nearest_spaces.count() == 0:
        nearest_spaces = query_db.find({'blockgroup': blockgroup})
        if not nearest_spaces:
            return None

    closest_space = None
    smallest_distance = 2000

    for space in nearest_spaces:

        eval_lat = space['geometry']['location']['lat'] if database == 'spaces' else space['lat']
        eval_lng = space['geometry']['location']['lat'] if database == 'spaces' else space['lng']

        distance = utils.distance((lat, lng), (eval_lat, eval_lng))

        if distance < smallest_distance:
            smallest_distance = distance
            closest_space = space

    return closest_space


if __name__ == "__main__":

    def test_get_nearest_space():

        test_lat = 34.048219
        test_lng = -118.239825
        test_space = get_nearest_space(test_lat, test_lng, database='vectors')

        print(test_space)
        distance = utils.distance((test_lat, test_lng), (test_space['lat'], test_space['lng']))

        print(distance)

    test_get_nearest_space()
