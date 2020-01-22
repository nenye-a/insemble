from utils import DB_SPACE
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


def place_aggregate():
    return
    # TODO: pull from data_base


if __name__ == "__main__":
    print(DB_SPACE)
