from mongo_connect import Connect
import data_aggregator.utils
import data_aggregator.goog
import data_aggregator.foursquare
import data_aggregator.random
import data_aggregator.spatial
import data_aggregator.arcgis
import data_aggregator.environics
import pandas as pd



# Let's make a matching algorithm that uses our data really quickly!!
def matching(address, name):
    '''

    Returns a list of matching locations when provided an address and name of a location. Alternatively the address and the name will
    be hard coded if nothing is provided.

    '''

    address = address if address not None else ''
    name = name if name not None else ''

    # find the details of the location that we want

    # load the data_set using pandas from csv function
    dataset = pd.read_csv()