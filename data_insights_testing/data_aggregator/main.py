from utils import DB_AGGREGATE, DB_SICS, DB_RAW_SPACE
import goog
import pitney


'''

Database aggregator. This script will aggregate places within a specific geogrpahic
location, and populate application database with all of the available options. Function
is split into sections, which all run in parallel.

* Place aggregator * - finds index of possible locations using Pitney Bowes & stores the
                        the corresponding details for validation using google.

* Place validator * - utilizes google to validate aggregated places. Validated places
                      will include the name, address, place_id, sales, & geometric
                      location.

* Detail builder * - utilize variiety of sources to fill out the details of the location,
                     if the details have not already been obtained during validation.

* Proximity builder * - utilize google to determine all the nearby points of interest in
                        the location of the building under review

* Geographic data aggregator * - aggregate all the spatial location demographic and
                                 psycho-graphic information.

'''


# Main execution method for database aggregation
def run(city, state, zip_code=None):
    '''

    Main executable for aggregator.

    city, state, zipcode - area of which aggregation is desired

    '''

    return "INCOMPLETE"


def place_aggregate(city, state, zip_code=None, iter_step=500):

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
        print(run_record)
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

    while True:
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
            processed_sics = set(run_record['processed_sics'].extend(
                active_sic_codes.split(',')))
            all_sics = set(all_sic_codes)
            remaining_sics = all_sics.difference(processed_sics)

            if len(remaining_sics) == 0:
                print("Area now fully tapped for all existing sics")
                return True

            active_sic_codes = ','.join(list(remaining_sics)[:max_sics])

            # update record with new processed sics, active sic codes, and page
            page = 1
            DB_AGGREGATE.update({'city': city, 'state': state}, {
                'in_process_sic_codes': active_sic_codes,
                'processed_sics': list(processed_sics),
                'current_page': page
            })

            print('sdf')
        else:
            print(next_page)

            # otherwise just move to next page
            DB_AGGREGATE.update({'city': city, 'state': state}, {'$set': {
                                'current_page': next_page}})

            page = next_page

        DB_RAW_SPACE.insert_many([
            {
                'name': item['name'],
                'location': {
                    'lat': item['geometry']['coordinates'][1],
                    'lng': item['geometry']['coordinates'][0],
                },
                'relevance': item['relevanceScore'],
                'pitney_address': item['contactDetails']['address'],
                'sales_USD': item.get('salesVolume', [{}])[0].get('value', None)
            } for item in data
        ])
        print("*** PLACE_AGGREGATOR: {} more places added", len(data))


if __name__ == "__main__":

    def test_place_aggregator():
        place_aggregate('Los Angeles', 'CA', iter_step=100)

    test_place_aggregator()
