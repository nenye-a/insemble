'''

This file will take raw places from goole and generate them into actual places and brands.
It will also generate locations and their details.

'''
import utils
import datetime
import goog as google
import pprint
from fuzzywuzzy import fuzz
import spatial

# # indempotently create index - BRANDS
# utils.DB_BRANDS.create_index([("brand_name", 1), ("brand_name", "text")], unique=True)
# utils.DB_BRANDS.create_index([("domain", 1)], unique=True, sparse=True)

# # indempotently places - PLACES
# utils.DB_PLACES.create_index([("google_place_id", 1)], unique=True)
# utils.DB_PLACES.create_index([("location", "2dsphere")])
# utils.DB_PLACES.create_index([("brand_id", 1)])

# # indempotently places - LOCATIONS
# utils.DB_LOCATIONS.create_index([("location", "2dsphere")])


def process_place(place):
    """
    Build a place into the same structure as what's been defined in the 
    mongo_schema. This should eventually be placed into a Places class.
    """

    google_place_id = place["place_id"]
    location = {
        "type": "Point",
        "coordinates": [
            place["geometry"]["location"]["lng"],
            place["geometry"]["location"]["lat"]
        ]
    }
    address = place["formatted_address"]
    address_components = place["address_components"]
    name = place["name"]
    property_id = None
    popularity = [{
        'last_update': datetime.datetime.utcnow().replace(microsecond=0).isoformat(),
        'source': "Google",
        'user_ratings_total': place["user_ratings_total"],
        'rating': place["rating"],
        'reviews': place['reviews'] if 'reviews' in place else []
    }] if 'rating' in place else []
    price = [{
        'last_update': datetime.datetime.utcnow().replace(microsecond=0).isoformat(),
        'price_level': place["price_level"],
        'source': "Google"
    }] if 'price_level' in place else []

    photos = {}
    if 'photos' in place and len(place['photos']) > 0:
        other = [
            google.get_photo_url(item['photo_reference']) for item in place['photos']
        ]
        main = other.pop(0)
        photos = {
            'main': main,
            'other': other
        }
    opening_hours = place['opening_hours']['periods'] if 'opening_hours' in place else []
    description = ""
    annual_sales = [{
        'last_update': datetime.datetime.utcnow().replace(microsecond=0).isoformat(),
        'year': "2019",
        'value': int(place['sales']),
        'source': 'Pitney Bose'
    }] if 'sales' in place else []
    website = place['website'] if 'website' in place else None
    phone_number = place["international_phone_number"]
    foursquare_categories = {
        'categories': [{
            'name': category['category_name'],
            'short_name': category['category_short_name']
        } for category in place['foursquare_categories']],
        'source': "Foursquare"
    } if 'foursquare_categories' in place else None
    google_categories = {
        'categories': [{
            'name': category,
            'short_name': category
        } for category in place['types']],
        'source': "Google"
    } if 'types' in place else None
    categories = []
    if foursquare_categories:
        categories.append(foursquare_categories)
    if google_categories:
        categories.append(google_categories)

    this_place = {
        # 'location_id': location_id,
        # 'brand_id': brand_id,
        'google_place_id': google_place_id,
        'location': location,
        'address': address,
        'address_components': address_components,
        'name': name,
        'annual_sales': annual_sales,
        'property_id': property_id,
        'popularity': popularity,
        'price': price,
        'photos': photos,
        'opening_hours': opening_hours,
        'website': website,
        'description': description,
        'categories': categories,
        'phone_number': phone_number
    }

    # location_id = upload_location(place)
    brand_id = upload_brand(this_place, place)
    print(brand_id)

    # brand_id = "Test"
    # location_id = "Test"

    return this_place


def most_relevant_brand(name, domain=None):

    # check first if we have a brand with the same domain. If so return that
    # as that is most likely the same business.
    if domain:
        brand = utils.DB_BRANDS.find_one({"domain": domain})
        if brand:
            return brand

    # Otherwise, fuzzily search using Lucene method for the top three matching brands.
    scored_brands = utils.DB_BRANDS.find(
        {"$text": {"$search": name}},
        {"score": {"$meta": "textScore"}}
    ).sort([("score", {"$meta": "textScore"})]).limit(3)

    brands = list(scored_brands)

    most_relevant_brand = None
    for brand in brands:
        ratio = fuzz.WRatio(name, brand["brand_name"])
        # use better Levinston matching to determine how close the names are
        # if very close, return the brand.
        if ratio < 89:
            continue
        if not most_relevant_brand or ratio > most_relevant_brand["score"]:
            most_relevant_brand = brand

    if most_relevant_brand:
        most_relevant_brand.pop("score")

    return most_relevant_brand


def upload_brand(this_place, place):

    brand = most_relevant_brand(this_place['name'], this_place['website'])

    if not brand:
        # build out the brand if there is no existing brand.
        brand_name = this_place["name"]
        alias = brand_name
        logo = place["logo"] if 'logo' in place else None
        headquarters_address = None
        domain = this_place['website']

        average_popularity = this_place['popularity'].copy()
        average_price = this_place['price'].copy()
        for price_object in average_price:
            price_object['priced_locations'] = 1

        years_operation = None
        description = ""
        categories = this_place['categories']
        similar_brands = []
        average_demographics = {}  # TODO
        average_psychographics = {}  # TODO

        annual_sales = this_place['annual_sales'].copy()
        for sales_object in annual_sales:
            sales_object['average_sales_value'] = sales_object.pop('value')
            sales_object['recorded_sales_locations'] = 1

        match_requests = {}
        contacts = {}
        number_found_locations = 1
        number_locations = None

        brand = {
            'brand_name': brand_name,
            'alias': alias,
            'logo': logo,
            'headquarters_address': headquarters_address,
            'domain': domain,
            'number_locations': number_locations,
            'number_found_locations': number_found_locations,
            'average_popularity': average_popularity,
            'average_price': average_price,
            'years_operation': years_operation,
            'description': description,
            'categories': categories,
            'similar_brands': similar_brands,
            'average_demographics': average_demographics,
            'average_psychographics': average_psychographics,
            'annual_sales': annual_sales,
            'contacts': contacts,
            'match_requests': match_requests,
        }
    else:
        # if there is an existing brand, let's splice their results together.
        if not brand['logo']:
            brand['logo'] = place["logo"] if 'logo' in place else None
        if not brand['domain'] and this_place['website']:
            brand['domain'] = this_place['website']

        # adding the popularity of this place to the existing brand.
        if len(brand['average_popularity']) == 0:
            brand['average_popularity'] = this_place['popularity'].copy()
        else:
            source_popularity = {}
            # first find all the new items we're updating
            for popularity_object in this_place['popularity']:
                source_popularity[popularity_object['source']] = popularity_object
            # secondly, find and update sources that we need to in the existing document
            for average_popularity_object in brand["average_popularity"]:
                source = average_popularity_object['source']
                if source not in source_popularity:
                    continue
                popularity_object = source_popularity.pop(source)
                previous_total_rating = average_popularity_object['rating'] * average_popularity_object['user_ratings_total']
                this_total_rating = popularity_object['rating'] * popularity_object['user_ratings_total']
                average_popularity_object['user_ratings_total'] += popularity_object['user_ratings_total']
                average_popularity_object['rating'] = (previous_total_rating + this_total_rating) / \
                    average_popularity_object['user_ratings_total']
                average_popularity_object['last_update'] = datetime.datetime.utcnow().replace(microsecond=0).isoformat()
            # finally, let's add new source information that is not found in the existing document.
            for source, popularity_object in source_popularity.items():
                brand['average_popularity'].append(popularity_object)

        if len(brand['average_price']) == 0:
            brand['average_price'] = this_place['price'].copy()
            for price_object in brand['average_price']:
                price_object['priced_locations'] = 1
        else:
            # FIXME: needs to be updated to handle the addition of a new source that hasn't been seen
            source_price = {}
            # similar method to popularity, find all, update existing, add new
            for price_object in this_place['price']:
                source_price[price_object['source']] = price_object
            for average_price_object in brand["average_price"]:
                source = average_price_object['source']
                if source not in source_price:
                    continue
                price_object = source_price.pop(source)
                previous_total_price = average_price_object['price_level'] * average_price_object['priced_locations']
                average_price_object['priced_locations'] += 1
                average_price_object['price_level'] = round(
                    (previous_total_price + price_object['price_level']) / average_price_object['priced_locations'], 2)
                average_price_object['last_update'] = datetime.datetime.utcnow().replace(microsecond=0).isoformat()
            for source, price_object in source_price:
                price_object = price_object.copy()
                price_object['priced_locations'] = 1
                brand['average_price'].append(price_object)

        if len(brand['categories']) == 0:
            brand['categories'] = this_place['categories'].copy()
        else:
            source_category = {}
            # similar method to popularity, find all, update existing, add new
            for category in this_place['categories']:
                source_category[category['source']] = category
            for brand_category in brand['categories']:
                source = brand_category['source']
                if source not in source_category:
                    continue
                new_categories = source_category.pop(source)

                new_category_tuples = [(c['name'], c['short_name']) for c in new_categories['categories']]
                brand_category_tuples = [(c['name'], c['short_name']) for c in brand_category['categories']]
                final_categories = set(new_category_tuples + brand_category_tuples)

                brand_category['categories'] = [{'name': c[0], 'short_name': c[1]} for c in final_categories]

                # brand_category['categories'] += new_categories['categories']
                # brand_category['categories'] = list(set(brand_category['categories']))
            for source, new_categories in source_category.items():
                brand['categories'].append(new_categories)

        average_demographics = {}  # TODO
        average_psychographics = {}  # TODO

        if len(brand['annual_sales']) == 0:
            brand['annual_sales'] == this_place['annual_sales'].copy()
            for sales_object in brand['annual_sales']:
                sales_object['average_sales_value'] = sales_object.pop('value')
                sales_object['recorded_sales_locations'] = 1
        else:
            source_sales = {}
            # similar method to popularity, find all, update existing, add new - except with more name changing
            for sales_object in this_place['annual_sales']:
                source_sales[sales_object['source']] = sales_object
            for average_sales_object in brand['annual_sales']:
                source = average_sales_object['source']
                if source not in source_sales:
                    continue
                sales_object = source_sales.pop(source)
                previous_total_sales = average_sales_object['average_sales_value'] * average_sales_object['recorded_sales_locations']
                average_sales_object['recorded_sales_locations'] += 1
                average_sales_object['average_sales_value'] = round(
                    (previous_total_sales + sales_object['value']) / average_sales_object['recorded_sales_locations'], 2)
            for source, sales_object in source_sales:
                sales_object = sales_object.copy()
                sales_object['average_sales_value'] = sales_object.pop('value')
                sales_object['recorded_sales_locations'] = 1
                brand['annual_sales'].append(sales_object)

        brand['number_found_locations'] += 1

    # if _id is in the brand, it's highly likely that this is an existing brand. Let's update it.
    if "_id" in brand:
        utils.DB_BRANDS.update({'_id': brand['_id']}, {'$set': brand}, upsert=True)
        brand_id = brand["_id"]
    # otherwise, let's simply inser the new brand and return the id
    else:
        brand_id = utils.DB_BRANDS.insert(brand)

    return brand_id


if __name__ == "__main__":
    place = utils.DB_PROCESSED_SPACE.find_one({"place_id": "ChIJnQCUtku5woARaFvnh8vqSn4"})
    process_place(place)
    # pprint.pprint(process_place(place))

    pass
