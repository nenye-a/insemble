from main import place_aggregator, place_validator, detail_builder, proximity_builder, TYPE_T, TYPE_S
import threading
from utils import DB_ZIP_CODES, DB_AGGREGATE, DB_SICS, DB_TYPES

'''

Database aggregator. This script will aggregate places within a specific geogrpahic
location, and populate application database with all of the available options. Function
is split into sections, which all run in parallel.

* Place aggregator * - finds index of possible locations using Pitney Bowes & stores the
                        the corresponding details for validation using google.

* Place validator * - utilizes google to validate aggregated places. Validated places
                      will include the name, address, place_id, sales, & geometric
                      location. Google details retrieved in detail builder as Google
                      does not return all fields.

* Detail builder * - utilize variiety of sources to fill out the details of the location,
                     if the details have not already been obtained during validation.

* Proximity builder * - utilize google to determine all the nearby points of interest in
                        the location of the building under review

* Geographic data aggregator * - aggregate all the spatial location demographic and
                                 psycho-graphic information.

'''


# Main execution method for database aggregation
def run_all(city, state, zip_code=None):
    '''

    Main executable for aggregator.

    city, state, zipcode - area of which aggregation is desired.
    state represented as XX

    '''

    validator_thread = threading.Thread(target=place_validator)
    detail_thread = threading.Thread(target=detail_builder)
    proximity_thread = threading.Thread(target=proximity_builder)

    validator_thread.start()
    detail_thread.start()
    proximity_thread.start()


def aggregate_by_zip(aggregate_type=TYPE_T):

    zip_codes = DB_ZIP_CODES.find_one(
        {'name': 'Los_Angeles_County_Zip_Codes'})['zip_codes']

    active = None
    if aggregate_type == TYPE_T:
        active = DB_TYPES.find_one({'name': 'place_types'})['types']
    elif aggregate_type == TYPE_S:
        active = DB_SICS.find_one({'name': 'sic_code_list'})['sics']

    for zip_code in zip_codes:

        record = DB_AGGREGATE.find_one({
            'zip_code': zip_code,
            'aggregate_type': aggregate_type
        })

        if record:
            if record['processed'] == active:
                continue

        place_aggregator('Los Angeles', 'CA', zip_code,
                         aggregate_type=aggregate_type)
    
    print('All DONE')


if __name__ == "__main__":

    aggregate_by_zip()

    # validator_thread = threading.Thread(target=place_validator)
    # detail_thread = threading.Thread(target=detail_builder)

    # validator_thread.start()
    # detail_thread.start()
