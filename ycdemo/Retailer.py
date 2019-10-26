class Retailer(object):
    '''
    This method initializes a Retailer

    :param name: name of retail or restaurant establishment
    :type str: ex "Wendy's"
    :param place_type: the categories in which the establishment falls into
    :type list: ex ["restaurant", "cafe", "middle_eastern"]
    :param cost: a number indicating the price range of the retailer
    :type float:

    '''
    def __init__(self, name, place_type, cost):
        self.name = name
        self.place_type = place_type
        self.cost = cost

    def __eq__(self, obj):
        return isinstance(obj, Retailer) and obj.name == self.name

