from utils import DB_AGGREGATE, DB_COLLECT, DB_SICS, DB_TYPES, DB_RAW_SPACE, DB_PROCESSED_SPACE, unique_db_index
import utils
import goog
import pitney
import foursquare
import time
import random
import spatial

'''

Underlying functions for the executable file in run.

'''

PROCESSED_FLAG = 'PROCESSED'
UN_PROCESSED_FLAG = 'UN_PROCESSED'
FAIL_FLAG = 'FAIL'
TYPE_S = 'sics'
TYPE_T = 'type'

unique_db_index(DB_RAW_SPACE, 'name', 'location')
unique_db_index(DB_PROCESSED_SPACE, 'place_id')
unique_db_index(DB_AGGREGATE, 'city', 'state', 'zip_code', 'aggregate_type')
unique_db_index(DB_COLLECT, 'run_name', 'type')


# Aggregate all the potential addresses from Pitney_Bose API
def place_aggregator(city, state, zip_code=None, iter_step=500,
                     aggregate_type=TYPE_S):

    insert_count = 0

    if aggregate_type == TYPE_S:
        max_type = 3  # 3 aggregate type at a time
    elif aggregate_type == TYPE_T:
        max_type = 1  # one type at a time

    # pull the current status for the scrape on this city
    run_record = DB_AGGREGATE.find_one({
        'city': city,
        'state': state,
        'zip_code': zip_code,
        'aggregate_type': aggregate_type
    })

    # if no existing scrape, create one with base settings
    if not run_record:
        run_record = {
            'city': city,
            'state': state,
            'zip_code': zip_code,
            'aggregate_type': aggregate_type,
            'step': iter_step,
            'processed': [],
            'in_process': None,
            'current_page': 1
        }
        print("Aggregation restart using following settings:\n\n{}\n".format(run_record))
        print(DB_AGGREGATE.insert(run_record))
    else:
        print(
            "Aggregation starting with the following settings:\n\n{}\n".format(run_record))

    # Determine how to filter categories for the pitney bose requests (Refer to the api or pitney.py for more details)
    if aggregate_type == TYPE_S:
        all_codes = DB_SICS.find_one({'name': 'sic_code_list'})['sics']
    elif aggregate_type == TYPE_T:
        all_codes = DB_TYPES.find_one({'name': 'place_types'})['types']

    active_codes = run_record['in_process']

    if not active_codes:
        all_available = set(all_codes)
        processed = set(run_record['processed'])
        remaining = all_available.difference(processed)

        if len(remaining) == 0:
            print("Area has already been fully tapped for all present {}".format(
                aggregate_type))
            return True

        # batch active aggregate type 10 at a time (pitney bose limitaiton)
        active_codes = ','.join(
            list(remaining)[:max_type])

        run_record['in_process'] = active_codes

        DB_AGGREGATE.update_one(
            {'city': city, 'state': state, 'zip_code': zip_code, 'aggregate_type': aggregate_type}, {'$set': run_record})

    # move at the 500 searches at a time
    step = run_record['step']
    page = run_record['current_page']

    aggregating = True
    while aggregating:
        # iterate through pitney database using stock iteretion step.
        if aggregate_type == TYPE_S:
            result = pitney.poi_within_area(
                'USA', state, city, zip_code, sic_codes=active_codes, max_results=step, page=page)
        elif aggregate_type == TYPE_T:
            result = pitney.poi_within_area(
                'USA', state, city, zip_code, type_=active_codes, max_results=step, page=page)

        # if call fails, then return False
        if not result:
            print("Pitney call failed")
            return False

        data, next_page = result

        # if next_page is equal to this page, then we've fully tapped out the pitney source. (likely
        # not true and needs to be checked)
        if len(data) == 0:
            # update codes if all spaces for the existing aggregate_type have been tapped
            processed = set(
                run_record['processed'] + active_codes.split(','))
            all_available = set(all_codes)
            remaining = all_available.difference(processed)

            active_codes = ','.join(list(remaining)[:max_type])

            # update record with new processed aggregate type, active sic codes, and page
            page = 1
            run_record.update({
                'in_process': active_codes,
                'processed': list(processed),
                'current_page': page
            })
            DB_AGGREGATE.update_one(
                {'city': city, 'state': state, 'zip_code': zip_code, 'aggregate_type': aggregate_type}, {'$set': run_record})

            if len(remaining) == 0:
                print("(AA) Area now fully tapped for all existing {}".format(
                    aggregate_type))
                aggregating = False
                return aggregating

        else:
            # otherwise just move to next page
            run_record['current_page'] = next_page
            DB_AGGREGATE.update_one(
                {'city': city, 'state': state, 'zip_code': zip_code, 'aggregate_type': aggregate_type}, {'$set': run_record})

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
                    'aggregate_type': aggregate_type,
                    'status': UN_PROCESSED_FLAG
                } for item in data
            ], ordered=False)
        except:
            print(
                "(AA) ***** Failed to insert some docs into raw spaces likely due to duplicates *****")
        insert_count += len(data)
        print("(AA) ****** AGGREGATOR: {} more places added".format(len(data)))
        print("(AA) ****** Total documents inserted in this run: {}".format(insert_count))


# This place collector will preform a google_nearby BFS on a city to obtain all locations, within a bounded box.
# The collector, will find the distance and will continue to find distance on items until it spans the region.
# The biggest difference between the collector & the aggregator, is that collected places will have enough quality
# To be placed directly in the processed space database for additional detailing & demographics. Bounds are provided
# in the form of {'nw':(lat1,lng1), 'se'(lat2,lng2)}. Bounds only function for North America
def place_collector_google(start_lat, start_lng, type_, run_name, bounds, run_record=None):

    def in_bounds(lat, lng):
        lat_inbounds = lat < bounds['nw'][0] and lat > bounds['se'][0]
        lng_inbounds = lng > bounds['nw'][1] and lng < bounds['se'][1]
        return lat_inbounds and lng_inbounds

    def random_inbounds_point():
        lat = random.uniform(bounds['nw'][0], bounds['se'][0])
        lng = random.uniform(bounds['nw'][1], bounds['se'][1])
        return lat, lng

    # Find the correct run_record
    run_record = DB_COLLECT.find_one(
        {'run_name': run_name}) if run_record is None else run_record
    if not run_record:
        run_record = {
            'run_name': run_name,
            'type': type_,
            'calls': []
        }
        try:
            DB_COLLECT.insert_one(run_record)
        except Exception:
            print(
                "(CC_GOOGLE) ****** You've already created this run before, please rename...")
            raise

    # start where we left off if this record existed
    if len(run_record['calls']) > 0:
        start_lat = run_record['calls'][0]['next_lat']
        start_lng = run_record['calls'][0]['next_lng']

    print("(CC_GOOGLE) ****** Collecting items from google with the following history:\n{}\n".format(run_name))
    print("{} previous calls".format(len(run_record['calls'])))

    # Query starting point for the nearby google places
    places = goog.nearby(start_lat, start_lng, 'restaurant', rankby='distance')

    if places is None:
        places = []

    # Store all the locations
    try:
        DB_PROCESSED_SPACE.insert_many(places, ordered=False)
        print("(CC_GOOGLE) ****** Inserted items into database.")
    except Exception as err:
        print(err)
        print("(CC_GOOGLE) **** Attempted to insert {} into DB.".format(len(places)))
        print("(CC_GOOGLE) **** Failed to input all, likely due to duplicates")

    # Select the direction of the next search based on the theory of selecting the
    # direction of the highest density of place we have not seen yet.
    lng_delta = 0
    lat_delta = 0
    num_places = len(places)
    num_redundant_places = 0

    for place in places:

        # have we seen this location before?
        item = DB_PROCESSED_SPACE.find_one(
            {'place_id': place['place_id']})

        # Weight each place for density
        d = -0.4 if item else 1
        lng_delta += d * (place['geometry']['location']['lng'] - start_lng)
        lat_delta += d * (place['geometry']['location']['lat'] - start_lat)

        if item:
            num_redundant_places += 1

    weighted_lng = start_lng + lng_delta/num_places
    weighted_lat = start_lat + lat_delta/num_places

    # density direction
    weighted_bearing = utils.bearing(
        (start_lat, start_lng), (weighted_lat, weighted_lng))

    # density amplitude in density
    weighted_distance = utils.distance(
        (start_lat, start_lng), (weighted_lat, weighted_lng))

    # calculate the similarity of this location to what we already have
    similarity_ratio = float(num_redundant_places)/num_places

    # calculate the distance of coverage for this search
    furthest_distance = utils.distance(
        (start_lat, start_lng),
        (places[num_places-1]['geometry']['location']['lat'],
         places[num_places-1]['geometry']['location']['lng'])
    )

    search_weight = 1 + weighted_distance

    # Similarity is okay between 10-85%.
    if similarity_ratio > 0.85:
        search_weight = search_weight * 1.2
    elif similarity_ratio == 1:
        search_weight = search_weight * 3
    search_distance = search_weight * furthest_distance

    search_distance = .75 if search_distance > .75 else search_distance

    next_lat, next_lng = utils.location_at_distance(
        start_lat, start_lng, search_distance, weighted_bearing)

    # Check & correct bounds
    if not in_bounds(next_lat, next_lng) or places == []:
        next_lat, next_lng = random_inbounds_point()

    # Prevent
    if all(call['similarity'] > .90 for call in run_record['calls'][:30]):
        next_lat, next_lng = random_inbounds_point()

    next_lat = round(next_lat, 6)
    next_lng = round(next_lng, 6)

    call_update = {
        'lat': start_lat,
        'lng': start_lng,
        'search_distance': search_distance,
        'furthest_distance': furthest_distance,
        'similarity': similarity_ratio,
        'weighted_bearing': weighted_bearing,
        'weighted_distance': weighted_distance,
        'next_lat': next_lat,
        'next_lng': next_lng
    }

    run_record['calls'].insert(0, call_update)

    DB_COLLECT.update_one({'run_name': run_name}, {'$set': run_record})

    print("\n(CC_GOOGLE) ****** Moving to the next point after the following settings:\n{}\n ".format(call_update))

    place_collector_google(next_lat, next_lng, run_name,
                           type_, bounds, run_record=run_record)


###############################################


def place_collector_google_brute(start_lat, start_lng, type_, run_name, bounds, run_record=None, direction='down'):

    horizontal_bearing = 90 if direction == 'down' else 270
    vertical_bearing = 180 if direction == 'down' else 0

    def in_bounds(lat, lng):
        lat_inbounds = lat < bounds['nw'][0] and lat > bounds['se'][0]
        lng_inbounds = lng > bounds['nw'][1] and lng < bounds['se'][1]
        return lat_inbounds and lng_inbounds

    def random_inbounds_point():
        lat = random.uniform(bounds['nw'][0], bounds['se'][0])
        lng = random.uniform(bounds['nw'][1], bounds['se'][1])
        return lat, lng

    # Find the correct run_record
    run_record = DB_COLLECT.find_one(
        {'run_name': run_name, 'brute': True}) if run_record is None else run_record
    if not run_record:
        run_record = {
            'run_name': run_name,
            'type': type_,
            'calls': [],
            'brute': True,
        }
        try:
            DB_COLLECT.insert_one(run_record)
        except Exception:
            print(
                "(CC_GOOGLE) ****** You've already created this run before, please rename...")
            raise

    smallest_distance_observed = 1.5
    first_horizontal_call = None
    
    # start where we left off if this record existed
    if len(run_record['calls']) > 0:
        start_lat = run_record['calls'][0]['next_lat']
        start_lng = run_record['calls'][0]['next_lng']
        first_horizontal_call = run_record['calls'][0]['first_horizontal_call']

    print("(CC_GOOGLE) ****** Collecting items from google with the following history:\n{}\n".format(run_name))
    print("{} previous calls".format(len(run_record['calls'])))

    collecting = True

    while collecting:

        # Query starting point for the nearby google places
        places = goog.nearby(start_lat, start_lng,
                             type_, rankby='distance')

        if places is None or places == []:

            next_lat, next_lng = utils.location_at_distance(
                start_lat, start_lng, 2, horizontal_bearing)  # move horizontally using the largest distance
            next_lat, next_lng = round(next_lat, 6), round(next_lng, 6)

            call_update = {
                'lat': start_lat,
                'lng': start_lng,
                'search_distance': None,
                'furthest_distance': None,
                'similarity': None,
                'next_lat': next_lat,
                'next_lng': next_lng,
                'smallest_distance_observed': smallest_distance_observed,
                'first_horizontal_call': first_horizontal_call
            }
            run_record['calls'].insert(0, call_update)
            DB_COLLECT.update_one({'run_name': run_name}, {'$set': run_record})
            start_lat, start_lng = next_lat, next_lng
            continue

        # Select the direction of the next search based on the theory of selecting the
        # direction of the highest density of place we have not seen yet.
        num_places = len(places)
        num_redundant_places = 0
        for place in places:
            # have we seen this location before?
            item = DB_PROCESSED_SPACE.find_one(
                {'place_id': place['place_id']})
            if item:
                num_redundant_places += 1
        # calculate the similarity of this location to what we already have
        similarity_ratio = float(num_redundant_places)/num_places

        # Store all the locations
        try:
            DB_PROCESSED_SPACE.insert_many(places, ordered=False)
            print("(CC_GOOGLE) ****** Inserted items into database.")
        except Exception as err:
            print(err)
            print("(CC_GOOGLE) **** Attempted to insert {} into DB.".format(len(places)))
            print("(CC_GOOGLE) **** Failed to input all, likely due to duplicates")
        
        # calculate the distance of coverage for this search
        furthest_distance = utils.distance(
            (start_lat, start_lng),
            (places[num_places-1]['geometry']['location']['lat'],
             places[num_places-1]['geometry']['location']['lng'])
        )

        search_distance = furthest_distance

        if furthest_distance < smallest_distance_observed:
            smallest_distance_observed = furthest_distance

        if first_horizontal_call is None:
            first_horizontal_call = (start_lat, start_lng)

        # # Speed up if too much similarity
        # if len(run_record['calls']) > 20:
        #     too_similar = True
        #     for call in run_record['calls'][:20]:
        #         if call['similarity'] and call['similarity'] < .90:
        #             too_similar = False

        #     if too_similar:
        #         search_distance = search_distance * 1.5

        next_lat, next_lng = utils.location_at_distance(
            start_lat, start_lng, search_distance, horizontal_bearing)  # move horizontally using the largest distance

        next_lat, next_lng = round(next_lat, 6), round(next_lng, 6)

        # Check & correct bounds
        if not in_bounds(next_lat, next_lng):
            # If point is out of bounds, go to the first horizontal call & go downwards on the map of LA
            next_lat, next_lng = utils.location_at_distance(
                first_horizontal_call[0], first_horizontal_call[1], smallest_distance_observed, vertical_bearing)
            next_lat, next_lng = round(next_lat, 6), round(next_lng, 6)
            first_horizontal_call = None
            smallest_distance_observed = 1.5
            if not in_bounds(next_lat, next_lng):
                print(
                    "(CC_GOOGLE_FORCE) **** Two inbound calls detected, expecting complete collection")
                collecting = False
                return

        call_update = {
            'lat': start_lat,
            'lng': start_lng,
            'search_distance': search_distance,
            'furthest_distance': furthest_distance,
            'similarity': similarity_ratio,
            'next_lat': next_lat,
            'next_lng': next_lng,
            'smallest_distance_observed': smallest_distance_observed,
            'first_horizontal_call': first_horizontal_call
        }
        run_record['calls'].insert(0, call_update)
        DB_COLLECT.update_one({'run_name': run_name}, {'$set': run_record})

        start_lat, start_lng = next_lat, next_lng
        print("\n(CC_GOOGLE) ****** Status update | name: {}".format(run_record['run_name']))
        print("\n(CC_GOOGLE) ****** Moving to the next point after the following settings:\n{}\n ".format(call_update))


# Validate & Process raw_spaces into better spaces within the database
# VAlidates all non_processed items that match the conditions specified
def place_validator(condition=None):

    insert_count = 0
    validating = True

    database_query = {'status': UN_PROCESSED_FLAG}
    if condition:
        database_query.update(condition)

    while validating:
        # Get all spaces that have not been processed
        raw_spaces = DB_RAW_SPACE.find(database_query)

        # set up updates for batching
        _ids = []
        processed_spaces = []
        update_batch_size = 5

        for raw_space in raw_spaces:

            _id = raw_space['_id']
            name = raw_space['name']
            address = raw_space['pitney_address']['formattedAddress']
            lat, lng = raw_space['location']['lat'], raw_space['location']['lng']
            bias = 'point' + str(lat) + ',' + str(lng)

            processed_space = goog.find(address, name, bias)

            # if the space does not exist, then move along.
            if not processed_space:
                print("(VV) **** Space does not exist, moving on.")
                DB_RAW_SPACE.update({'_id': _id}, {'$set': {
                    'status': FAIL_FLAG
                }})
                continue

            # Otherwise, add the space to the update queue.
            processed_space['sales'] = raw_space['sales_USD']

            _ids.append(_id)
            processed_spaces.append(processed_space)

            # Once batching sized reached, update all the documents
            if len(_ids) >= update_batch_size:
                DB_RAW_SPACE.update_many({'_id': {'$in': _ids}}, {
                    '$set': {'status': PROCESSED_FLAG}
                })

                try:
                    DB_PROCESSED_SPACE.insert_many(
                        processed_spaces, ordered=False)
                except Exception:
                    print(
                        "(VV) ***** Failed to insert into processed all likely due to duplicates *****")

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
            # TODO: should check if it exists before entering
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
            DB_PROCESSED_SPACE.update_one(
                {'place_id': place_id}, {'$set': space})

            update_count += 1
            if update_count % update_size == 0:
                print(
                    "(DD) ****** DETAILER: {} more places detailed".format(update_count/update_size))
                print(
                    "(DD) ****** Total documents detailed in this run: {}".format(update_count))

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


# psychographics builder
def psycho_builder(radius=1):
    update_count = 0
    update_size = 15  # how many records to update prior to pinging console
    updating = True

    cats, spatial_df = spatial.create_spatial_cats_and_df()
    block_df = spatial.create_block_grp_df()

    while updating:

        spaces = DB_PROCESSED_SPACE.find(
            {'psycho_finished': {'$exists': False}})

        for space in spaces:
            place_id = space['place_id']

            # update with spatial data
            lat = space['geometry']['location']['lat']
            lng = space['geometry']['location']['lng']
            psycho_dict = spatial.get_psychographics(
                lat, lng, radius, spatial_df, block_df, cats)

            # space has been detailed and will be updated
            DB_PROCESSED_SPACE.update_one(
                {'place_id': place_id}, {'$set': {'psycho': psycho_dict, 'psycho_finished': True}})

            update_count += 1
            if update_count % update_size == 0:
                print(
                    "(DD) ****** PSYCHO DETAILS: {} more places psycho detailed".format(update_count/update_size))
                print(
                    "(DD) ****** Total documents psycho detailed in this run: {}".format(update_count))

        # wait atleast a second before re calling database
        time.sleep(5)


if __name__ == "__main__":

    def test_place_aggregator():
        place_aggregator('Los Angeles', 'California', iter_step=100)

    # test_place_aggregator()
    # place_validator()
    # detail_builder()
    # proximity_builder()

    # psycho_builder()

    spaces = DB_PROCESSED_SPACE.find()
    for count, space in enumerate(spaces):
        print(count, space)
        if count == 1:
            break
