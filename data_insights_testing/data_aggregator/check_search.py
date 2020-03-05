import utils
from fuzzywuzzy import fuzz

if __name__ == "__main__":

    search = "autozone"

    brands = utils.DB_BRANDS.find({
        '$text': {'$search': search},
    }, {'brand_name': 1, "score": {"$meta": "textScore"}}).sort([("score", {"$meta": "textScore"})]).limit(10)

    for brand in brands:
        print("name - {} / score - {} / fuzz_score - {}".format(brand["brand_name"],
                                                                brand["score"], fuzz.QRatio(brand["brand_name"], search)))
