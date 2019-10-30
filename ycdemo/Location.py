class Location(object):

    """
    This method initializes a Retail Location

    :param address: The address the of the retail location
    :type address: string, ex "75 Federal St # 15, Boston, MA 02110, USA"
    :param census: The demographic details surrounding a particular location, specifically ethnicities making up that location within a given radius
    :type census: dict, ex {"asian":"1.1","black":"4.8","hispanic":"14.1","indian":"4.5","island":"0.1","multi":"2.5","white":"74.2"}
    :param pop: population returned within a certain radius of the location
    :type pop: float
    :param income: average income of population within a given radius
    :type income: float
    :param traffic: number of people who pass by the location each day
    :type traffic: int
    :param safety: safety rating of the region in which the location falls
    :type safety: float
    :param nearby: top 5 most prevalent stores within a given radius of location
    :type nearby: list, ex ["restaurant", "cafe", "middle_eastern", "sushi", "auto_care"]
    """
    def __init__(self, address, census, pop, income, traffic, safety, nearby, radius):
        self.address = address
        self.census = census
        self.pop = pop
        self.income = income
        self.traffic = traffic
        self.safety = safety
        self.nearby = nearby
        self.radius = radius
        self.sqf
        self.floors

    def __eq__(self, obj):
        ####
        #### TODO: function to compare similar addresses
        ####
        return isinstance(obj, Location) and obj.address == self.address

