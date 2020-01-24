from utils import DB_AGGREGATE, DB_SICS, DB_RAW_SPACE, DB_PROCESSED_SPACE, unique_db_index
import utils
import goog
import pitney
import foursquare
import pymongo
import time


'''

Underlying functions for the executable file in run.

'''

PROCESSED_FLAG = 'PROCESSED'
UN_PROCESSED_FLAG = 'UN_PROCESSED'
FAIL_FLAG = 'FAIL'

unique_db_index(DB_RAW_SPACE, 'name', 'location')
unique_db_index(DB_PROCESSED_SPACE, 'place_id')
unique_db_index(DB_AGGREGATE, 'city', 'state')


# Aggregate all the potential addresses from Pitney_Bose API
def place_aggregator(city, state, zip_code=None, iter_step=500):

    insert_count = 0
    max_sics = 3

    # pull the current status for the scrape on this city
    run_record = DB_AGGREGATE.find_one({
        'city': city,
        'state': state
    })

    # if no existing scrape, create one with base settings
    if not run_record:
        run_record = {
            'city': city,
            'state': state,
            'step': iter_step,
            'processed_sics': [],
            'in_process_sic_codes': None,
            'current_page': 1
        }
        print("Aggregation restart using following settings:\n\n{}".format(run_record))
        print(DB_AGGREGATE.insert(run_record))

    # Determine the sics that need to be processed (refer to pitney Bose API for details)
    all_sic_codes = DB_SICS.find_one({'name': 'sic_code_list'})['sics']
    active_sic_codes = run_record['in_process_sic_codes']
    if not active_sic_codes:
        all_sics = set(all_sic_codes)
        processed_sics = set(run_record['processed_sics'])
        remaining_sics = all_sics.difference(processed_sics)

        if len(remaining_sics) == 0:
            print("Area has already been fully tapped for all present sics")
            return True

        # batch active sics 10 at a time (pitney bose limitaiton)
        active_sic_codes = ','.join(
            list(remaining_sics)[:max_sics])
        DB_AGGREGATE.update({'city': city, 'state': state}, {'$set': {
            'in_process_sic_codes': active_sic_codes
        }})

    # move at the 500 searches at a time
    step = run_record['step']
    page = run_record['current_page']

    aggregating = True
    while aggregating:
        # iterate through pitney database using stock iteretion step.
        result = pitney.poi_within_area(
            'USA', state, city, zip_code, active_sic_codes, step, page)

        # if call fails, then return False
        if not result:
            print("Pitney call failed")
            return False

        data, next_page = result

        # if next_page is equal to this page, then we've fully tapped out the pitney source. (likely
        # not true and needs to be checked)
        if page != 1 and next_page == page:
            # update sics if all spaces for the existing sics have been tapped
            processed_sics = set(
                run_record['processed_sics'] + active_sic_codes.split(','))
            all_sics = set(all_sic_codes)
            remaining_sics = all_sics.difference(processed_sics)

            if len(remaining_sics) == 0:
                print("(AA) Area now fully tapped for all existing sics")
                aggregating = False
                return aggregating

            active_sic_codes = ','.join(list(remaining_sics)[:max_sics])

            # update record with new processed sics, active sic codes, and page
            page = 1
            DB_AGGREGATE.update({'city': city, 'state': state}, {
                'in_process_sic_codes': active_sic_codes,
                'processed_sics': list(processed_sics),
                'current_page': page
            })
        else:
            pass

            # otherwise just move to next page
            DB_AGGREGATE.update({'city': city, 'state': state}, {'$set': {
                                'current_page': next_page}})

            page = next_page

        try:
            DB_RAW_SPACE.insert_many([
                {
                    'name': item['name'],
                    'location': {
                        'lat': item['geometry']['coordinates'][1],
                        'lng': item['geometry']['coordinates'][0],
                    },
                    'relevance': item['relevanceScore'],
                    'pitney_address': item['contactDetails']['address'],
                    'sales_USD': item.get('salesVolume', [{}])[0].get('value', None),
                    'status': UN_PROCESSED_FLAG
                } for item in data
            ], ordered=False)
        except:
            print(
                "(AA) ***** Failed to insert some docs into raw spaces likely due to duplicates *****")
        insert_count += len(data)
        print("(AA) ****** AGGREGATOR: {} more places added".format(len(data)))
        print("(AA) ****** Total documents inserted in this run: {}".format(insert_count))


# Validate & Process raw_spaces into better spaces within the database
def place_validator():

    insert_count = 0
    validating = True

    while validating:
        # Get all spaces that have not been processed
        raw_spaces = DB_RAW_SPACE.find({'status': UN_PROCESSED_FLAG})

        # set up updates for batching
        _ids = []
        processed_spaces = []
        update_batch_size = 30

        for raw_space in raw_spaces:

            _id = raw_space['_id']
            name = raw_space['name']
            address = raw_space['pitney_address']['formattedAddress']
            lat, lng = raw_space['location']['lat'], raw_space['location']['lng']
            bias = 'point' + str(lat) + ',' + str(lng)

            processed_space = goog.find(address, name, bias)

            # if the space does not exist, then move along.
            if not processed_space:
                continue

            # Otherwise, add the space to the update queue.
            processed_space['sales'] = raw_space['sales_USD']

            _ids.append(_id)
            processed_spaces.append(processed_space)

            # Once batching sized reached, update all the documents
            if len(_ids) >= update_batch_size:
                try:
                    DB_PROCESSED_SPACE.insert_many(
                        processed_spaces, ordered=False)
                except Exception:
                    print(
                        "(VV) ***** Failed to insert int processed all likely due to duplicates *****")
                DB_RAW_SPACE.update_many({'_id': {'$in': _ids}}, {
                    '$set': {'status': PROCESSED_FLAG}
                })
                insert_count += len(processed_spaces)
                print(
                    "(VV) ****** VALIDATOR: {} more places added".format(len(processed_spaces)))
                print(
                    "(VV) ****** Total documents validated in this run: {}".format(insert_count))

                _ids = []
                processed_spaces = []

        # wait atleast a second before re calling database
        time.sleep(5)


# gather all the details about this space
def detail_builder():

    update_count = 0
    update_size = 15  # how many records to update prior to pinging console
    updating = True

    while updating:

        spaces = DB_PROCESSED_SPACE.find({'detailed': {'$exists': False}})

        for space in spaces:
            place_id = space['place_id']

            # Google details will contain the following fields:
            # address_components, formated_address, formated_phone_number, adr_address, geometry
            # icon, international_phone_number, name, opening_hours, photos, place_id, price,
            # rating, reviews, types, url, vicinity, website
            google_details = goog.details(place_id)
            space.update(google_details)

            name = space['name']
            lat = space['geometry']['location']['lat']
            lng = space['geometry']['location']['lng']
            address = space['formatted_address']

            # Grab the four square categories for this location if they exist
            foursquare_details = foursquare.find(name, lat, lng, address)
            if foursquare_details:
                foursquare_categories = [{
                    'category_name': category['name'],
                    'category_short_name': category['shortName'],
                    'primary': category['primary']
                } for category in foursquare_details['categories']]
                space['foursquare_categories'] = foursquare_categories

            # space has been detailed and will be updated
            space['detailed'] = True
            DB_PROCESSED_SPACE.update_one(
                {'place_id': place_id}, {'$set': space})

            update_count += 1
            if update_count % update_size == 0:
                print(
                    "(DD) ****** DETAILER: {} more places detailed".format(update_count/update_size))
                print(
                    "(DD) ****** Total documents validated in this run: {}".format(update_count))

        # wait atleast a second before re calling database
        time.sleep(5)


# gather all places that are near this location
def proximity_builder(radius=1):

    update_count = 0
    updating = True

    # Types that are available and easily queriable from google
    type_queries = [
        'store', 'restaurant',  # general categories
        'park',  # key entertainment
        'subway_station',  # transportation
        'hospital',  # key services
        'church',  # key religion
        'university',
    ]

    # Types that cannot be queried as a type from google, but can be searched
    search_queries = []

    all_queries = type_queries + search_queries

    while updating:
        spaces = DB_PROCESSED_SPACE.find(
            {'$or': [{'nearby_complete': {'$ne': all_queries}}, {'nearby_complete': {'$exists': True}}]})

        for space in spaces:

            place_id = space['place_id']
            lat = space['geometry']['location']['lat']
            lng = space['geometry']['location']['lng']

            for query in type_queries:

                nearby_tag = 'nearby_' + query
                if nearby_tag in space:
                    continue

                nearby_places = goog.nearby(
                    lat, lng, query, radius=radius)  # need to add categories
                if not nearby_places:
                    continue

                # update the dictionary with this search details
                space[nearby_tag] = [{
                    'distance': utils.distance(
                        (lat, lng),
                        (place['geometry']['location']['lat'],
                         place['geometry']['location']['lng'])
                    ),
                    'place_id': place['place_id'],
                    'name': place['name'],
                    'types': place['types']
                } for place in nearby_places]

                space.get('nearby_complete', []).append(nearby_tag)
                DB_PROCESSED_SPACE.update_one(
                    {'place_id': place_id}, {'$set': space})
                print("(PP) {} complated for {}".format(
                    nearby_tag, space['name']))

            for query in search_queries:

                nearby_tag = 'nearby_' + query
                if nearby_tag in space:
                    continue

                nearby_places = goog.search(
                    lat, lng, query, radius=radius)  # need to add categories
                if not nearby_places:
                    continue

                # update the dictionary with this search details
                space[nearby_tag] = [{
                    'distance': utils.distance(
                        (lat, lng),
                        (place['geometry']['location']['lat'],
                         place['geometry']['location']['lng'])
                    ),
                    'place_id': place['place_id'],
                    'name': place['name'],
                    'types': place['types'],
                } for place in nearby_places]

                space.get('nearby_complete', []).append(nearby_tag)
                DB_PROCESSED_SPACE.update_one(
                    {'place_id': place_id}, {'$set': space})
                print("(PP) {} complated for {}".format(
                    nearby_tag, space['name']))

            update_count += 1
            print("(PP) ****** PROXIMITY: 1 more place fully proxified",)
            print(
                "(PP) ****** Total documents queried for proximity in this run: {}".format(update_count))


if __name__ == "__main__":

    def test_place_aggregator():
        place_aggregator('Los Angeles', 'California', iter_step=100)

    # test_place_aggregator()
    # place_validator()
    # detail_builder()
    # proximity_builder()
