from pymongo import MongoClient
from decouple import config
import urllib

'''

File to manage the connection to MongoDB resources. This includes managemenet of the connection,
as well as actual connection to the databases that are used.

'''

MONGO_USER = config("MONGO_USER")
MONGO_PASS = config("MONGO_DB_PASS")

# top level database connections
DB_SPACE = "spaceData"  # database for legacy spatial information
DB_APP_LEGACY = "appMatchData"  # legacy app database
DB_APP = "appData"  # hosts the main data for the application
DB_REQUESTS = "requests"  # database the hosts requests saved by safe_request

# collection connections - categories
SD_FOURSQUARE = "spaceData.foursquare_categories"
SD_SPATIAL_TAXONOMY = "spaceData.spatial_taxonomy"
SD_CATEGORIES = "spaceData.categories"

# collection connections - scraping
SD_AGGREGATE = "spaceData.aggregate_records"
SD_COLLECT = "spaceData.collect_records"

# collection connections - application support
AD_BRANDS = "appData.brands"
AD_PLACES = "appData.places"
AD_LOCATIONS = "appData.locations"
AD_LOCATION_MATCHES = "appData.location_matches"
AD_PROPERTY = "appData.properties"
AD_BRAND_SPACE = "appData.brand_space_matches"
AD_REGIONS = "appData.regions"

# collection connections - matching
SD_VECTORS = "spaceData.preprocessed_vectors"
SD_VECTORS_LA = "spaceData.LA_space_vectors"

# legacy databaces - pending deletion
AMD_TENANT = "appMatchData.tenant_details"
AMD_PROPERTY_LEGACY = "appMatchData.property_details"
SD_ZIP_CODES = "spaceData.zip_codes"
SD_PROCESSED_SPACE = "spaceData.spaces"
SD_OLD_SPACES = "spaceData.dataset2"
SD_SPATIAL_CATS = "spaceData.spatial_categories"
SD_DEMOGRAPHIC_CATS = "spaceData.demographic_categories"


class Connect(object):

    def __init__(self, connect=True):
        """
        Initialize connection to mongo_db database. By default, connection will automatically connect.

        Parameter:
        connect (boolean): True to connect on open, False to remain unconnected until first action.
        """
        self.connection = self.get_connection(connect)

    @staticmethod
    def get_connection(connect=True):
        mongo_uri = "mongodb+srv://" + urllib.parse.quote(MONGO_USER) + ":" + urllib.parse.quote(
            MONGO_PASS) + "@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE"
        return MongoClient(mongo_uri, connect=connect)

    def get_collection(self, collection_path):
        """
        Provided the collection path, will return the collection object of this connection.

        Parameters:
        collection_path (string): string path to the collection, starting first with the database

        """

        path = [path_item.strip() for path_item in collection_path.split('.')]
        collection = self.connection
        for db_item in path:
            collection = collection[db_item]

        return collection

    def close(self):
        """Close connection"""
        self.connection.close()


if __name__ == "__main__":
    def test_connection():
        my_connection = Connect()
        print(my_connection.connection)
        for item in my_connection.connection.list_databases():
            print(item)
        print(my_connection.get_collection(AD_PROPERTY).find_one())

    test_connection()
