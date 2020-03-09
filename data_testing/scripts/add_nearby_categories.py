import utils
import goog
import foursquare


'''
Script to query the database & flesh out our nearby categories
'''
# updates nearby categories for a specific place


def get_nearby_categories(place_id):
    # TODO: get nearby categories for a specific location

    space = utils.DB_PROCESSED_SPACE.find_one(
        {'place_id': place_id},
        {'nearby_store': 1, 'nearby_restaurant': 1}
    )

    for store in space['nearby_store']:
        full_store = utils.DB_PROCESSED_SPACE.find_one(
            {'place_id': store['place_id']})

        # add store to the database if it didn't already exist
        # TODO: when we are re collecting nearby stores we whould update here as well
        if not full_store:
            full_store = _find_ommitted_place(store['place_id'])
            if full_store is None:
                continue
        else:
            print("Space already exists in database! - {} ({})".format(
                full_store['name'], full_store['place_id']))

        if "foursquare_categories" in full_store:
            store["foursquare_categories"] = full_store["foursquare_categories"]
        store["lat"] = full_store["geometry"]["location"]["lat"]
        store["lng"] = full_store["geometry"]["location"]["lng"]

    for restaurant in space['nearby_restaurant']:

        full_restaurant = utils.DB_PROCESSED_SPACE.find_one(
            {'place_id': restaurant['place_id']})

        # add store to the database if it didn't already exist
        # TODO: when we are re collecting nearby we whould update here as well
        if not full_restaurant:
            full_restaurant = _find_ommitted_place(restaurant['place_id'])
            if full_restaurant is None:
                continue
        else:
            print("Space already exists in database! - {} ({})".format(
                full_restaurant['name'], full_restaurant['place_id']))

        if "foursquare_categories" in full_restaurant:
            restaurant["foursquare_categories"] = full_restaurant["foursquare_categories"]

        restaurant["lat"] = full_restaurant["geometry"]["location"]["lat"]
        restaurant["lng"] = full_restaurant["geometry"]["location"]["lng"]

    space['nearby_updated'] = True

    utils.DB_PROCESSED_SPACE.update_one(
        {'place_id': place_id}, {'$set': space})


def _find_ommitted_place(place_id):

    print("Finding ommitted space - ", end=" ")
    space = google.details(place_id)
    if not space:
        return None
    name = space['name']
    lat = space['geometry']['location']['lat']
    lng = space['geometry']['location']['lng']
    address = space['formatted_address']

    print(name, "({})".format(place_id))

    # Grab the four square categories for this location if they exist
    foursquare_details = foursquare.find(name, lat, lng, address)
    if foursquare_details:
        foursquare_categories = [{
            'category_name': category['name'],
            'category_short_name': category['shortName'],
            'primary': category['primary']
        } for category in foursquare_details['categories']]
        space['foursquare_categories'] = foursquare_categories

    # TODO: Check if the space has sales data & query pitney if it doesnt
    # space has been detailed and will be updated
    space['detailed'] = True
    try:
        utils.DB_PROCESSED_SPACE.insert_one(space)
    except:
        print("error inserting likely due to duplicate")
        return None

    return space


def run_category_update():
    updating = True
    batch_size = {'size': 50}
    while updating:

        query = {
            'nearby_store': {'$exists': True},
            'nearby_restaurant': {'$exists': True},
            'nearby_updated': {'$exists': False}
        }

        spaces = utils.DB_PROCESSED_SPACE.aggregate([
            {'$match': query},
            {'$sample': batch_size},
            {'$project': {'place_id': 1, 'name': 1}}
        ])

        for space in spaces:
            print("Updating nearby with categories for: {} ({})".format(
                space['name'], space['place_id']))
            get_nearby_categories(space['place_id'])


def update_category_list():

    space_categories = utils.DB_PROCESSED_SPACE.aggregate([
        {'$match': {'foursquare_categories.category_name': {'$exists': 1}}},
        {'$project': {'foursquare_categories': 1}}
    ])

    categories = {}
    count = 0
    for item in space_categories:
        for category in item['foursquare_categories']:
            category = category['category_name']
            if category not in categories:
                categories[category] = {'name': category}

            categories[category]['occurrence'] = categories[category].get('occurrence', 0) + 1
            count += 1
            # print(category)
            print('.', end="") if count % 500 == 0 else None

    # print(categories)
    for category in categories.values():
        utils.DB_CATEGORIES.update_one({'name': category['name']}, {'$set': category}, upsert=True)


if __name__ == "__main__":
    # run_category_update()
    update_category_list()
