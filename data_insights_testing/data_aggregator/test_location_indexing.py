import utils
from random import uniform


def random_locations():
    max_lat = 34.315406
    min_lat = 33.539911
    max_lng = -117.710207
    min_lng = -118.578487

    random_locations = [{
        "locations": {
            'type': "Point",
            'coordinates': [uniform(min_lng, max_lng), uniform(min_lat, max_lat)]
        }
    } for item in range(1000)]

    utils.DB_LOCATIONS.create_index([("locations", "2dsphere")])
    utils.DB_LOCATIONS.insert_many(random_locations)


def find_locations(lat, lng, radius):
    near_locations = utils.DB_LOCATIONS.find({'locations': {
        '$near': {
            '$geometry': {
                'type': "Point",
                'coordinates': [lng, lat]
            },
            '$maxDistance': utils.miles_to_meters(radius)
        }
    }})

    for locations in near_locations:
        coordinates = locations["locations"]["coordinates"]
        coordinates = (coordinates[1], coordinates[0])
        print(utils.distance((lat, lng), coordinates))
        print(locations["_id"])


if __name__ == "__main__":
    # random_locations()
    find_locations(33.7, -118.2, 5)
