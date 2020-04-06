import sys
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)  # include data_testing

from urllib.parse import urlparse
import time
import utils

PHOTO_API_URL = 'https://maps.googleapis.com/maps/api/place/photo'


def is_photo_api(photo_string):
    if PHOTO_API_URL in photo_string:
        return True
    else:
        return False


def replace_photos(place):

    if 'photos' not in place or place['photos'] == {}:
        return None

    main_photo = place['photos']['main'] if 'main' in place['photos'] else None
    other_photos = place['photos']['other'] if 'other' in place['photos'] else None

    photos = {}

    if main_photo and is_photo_api(main_photo):
        photos['main'] = strip_photo_url(main_photo)

    if other_photos:
        other = []
        for photo_url in other_photos:
            if is_photo_api(photo_url):
                other.append(strip_photo_url(photo_url))
        photos['other'] = other

    return photos


def strip_photo_url(google_api_url):

    params = urlparse(google_api_url).query
    for param in params.split("&"):
        if "photoreference" in param:
            photoreference = param.split("=")[1]
            return photoreference

    return None


if __name__ == "__main__":

    place = utils.DB_PLACES.find_one({'photos': {'$exists': True, '$ne': {}}})
    print(place['_id'])
    print(replace_photos(place))

    start = time.time()

    data_base_query = {'photos': {'$exists': True, '$ne': {}}, 'changed_photos': {'$exists': False}}
    pre_sample = {'size': 3000}
    batch_size = {'size': 100}

    updating = True
    attempt = 0
    while updating:

        # spaces = utils.DB_PROCESSED_SPACE.find({'pushed': {'$exists': False}}).limit(50)
        places = utils.DB_PLACES.aggregate([
            {'$sample': pre_sample},
            {'$match': data_base_query},
            {'$sample': batch_size},
        ])

        batch_start = time.time()

        for place in places:

            photos = replace_photos(place)
            update = {
                'photos': photos,
                'changed_photos': True
            }

            utils.DB_PLACES.update_one({'_id': place["_id"]}, {'$set': update})
            print("Updated place '{}' photos".format(place['_id']))

        batch_finish = time.time()

        if batch_finish - batch_start < .000001 and attempt == 4:
            if attempt == 4:
                updating = False
                continue
            attempt += 1

        attempt = 0
        print("Batch Complete - Elapsed Time in seconds: {}".format(batch_finish - batch_start))

    finish = time.time()

    this_time = finish - start
    print(this_time)
