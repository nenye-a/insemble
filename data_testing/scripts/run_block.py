import sys
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)  # include data_testing

import utils
import api.anmspatial as anmspatial

'''

Run file to get all the blocks for the items in the PROCESSED_SPACES database (spaceData.spaces).

'''


def blockify():
    """

    run to get the blocks

    """

    batch_size = {'size': 100}
    # query = {'$or': [{'block': {'$exists': False}}, {'blockgroup': {'$exists': False}}]}
    query = {'block': {'$exists': False}}

    # print(spaces.count())

    getting_blocks = True

    while getting_blocks:

        spaces = utils.DB_VECTORS_LA.aggregate([
            {'$match': query},
            {'$sample': batch_size}
        ])

        for place in spaces:
            lat = round(place['lat'], 6)
            lng = round(place['lng'], 6)

            block = anmspatial.point_to_block(lat, lng, state='CA', prune_leading_zero=False)

            if not block:
                continue

            blockgroup = block[:-3]

            update = {
                'block': block,
                'blockgroup': blockgroup
            }

            utils.DB_PROCESSED_SPACE.update_one({'place_id': place['loc_id']}, {'$set': update})
            utils.DB_VECTORS_LA.update_one({'loc_id': place['loc_id']}, {'$set': update})

            print(
                "**BB - Blockify: {} updated with block number {} and blockgroup number {}".format(
                    place['loc_id'], block, blockgroup)
            )


if __name__ == "__main__":
    blockify()
