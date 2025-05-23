class Retailer(object):
    """
    This method initializes a Retailer

    :param name: name of retail or restaurant establishment
    :type name: str, ex "Wendy's"
    :param place_type: the categories in which the establishment falls into
    :type place_type: set, set of strings. ex {"restaurant", "cafe", "middle_eastern"}
    :param price: a number indicating the price tier of the retailer
    :type price: float
    :param locations: all of the latitude longitude pairs of locations for the particular retailer
    :type locations: set, set of string tuples. ex {(33.5479999,-117.6711493), (33.54924617989272,-117.6698170201073)}

    """

    def __init__(self, name, place_type, price, locations):
        self.name = name
        self.place_type = place_type
        self.price = price
        self.locations = locations

    def to_json(self):
        type_dict = {}
        for ptype in self.place_type:
            type_dict[ptype] = 1

        return {"name": self.name, "place_type": type_dict, "price": self.price, "locations": list(self.locations)}
