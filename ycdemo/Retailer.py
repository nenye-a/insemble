class Retailer(object):
    """
    This method initializes a Retailer

    :param name: name of retail or restaurant establishment
    :type name: str, ex "Wendy's"
    :param place_type: the categories in which the establishment falls into
    :type place_type: set, set of strings. ex {"restaurant", "cafe", "middle_eastern"}
    :param cost: a number indicating the price range of the retailer
    :type cost: float
    :param locations: all of the latitude longitude pairs of locations for the particular retailer
    :type locations: set, set of string tuples. ex {(33.5479999,-117.6711493), (33.54924617989272,-117.6698170201073)}

    """
    def __init__(self, name, place_type, cost, locations):
        self.name = name
        self.place_type = place_type
        self.cost = cost
        self.locations = locations

    def __eq__(self, obj):
        return isinstance(obj, Retailer) and obj.name == self.name

