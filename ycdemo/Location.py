class Location(object):

    """
    This method initializes a Retail Location

    :param address: The address the of the retail location
    :type address: string, ex "75 Federal St # 15, Boston, MA 02110, USA"
    :param lat: Latitude of the location
    :type lat: float
    :param lng: Longitude of the location
    :type lng: float
    :param census: The demographic details surrounding a particular location, specifically ethnicities making up that location within a given radius
    :type census: dict, ex {"asian":1.1,"black":4.8,"hispanic":14.1,"indian":4.5,"island":0.1,"multi":2.5,"white":74.2}
    :param pop: population returned within a certain radius of the location
    :type pop: float
    :param income: average income of population within a given radius
    :type income: float
    :param traffic: number of people who pass by the location each day
    :type traffic: int
    :param safety: safety rating of the region in which the location falls
    :type safety: float
    :param nearby: nearby stores and number of occurrences within a given radius of location
    :type nearby: dictionary, ex {"restaurant": 7, "cafe": 6, "middle_eastern": 2, "sushi": 1, "auto_care": 1}
    :param radius: radius (mi) in which other parameters are tracked
    :type radius: float
    """
    def __init__(self, address, lat, lng, census, pop, income, traffic, safety, nearby, radius):
        self.address = address
        self.lat = lat
        self.lng = lng
        self.census = census
        self.pop = pop
        self.income = income
        self.traffic = traffic
        self.safety = safety
        self.nearby = nearby
        self.radius = radius
        self.sqf = None
        self.floors = None

    def to_json(self):
        return({"address": self.address, "lat": self.lat, "lng": self.lng, "census": self.census, "pop": self.pop,
                "income": self.income, "traffic": self.traffic, "safety": self.safety, "nearby": self.nearby,
                "radius": self.radius})

