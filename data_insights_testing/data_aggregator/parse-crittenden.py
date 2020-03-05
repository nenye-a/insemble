import datetime
import re
import utils
import create_places_brands
import csv

'''

File to process and parse files from the compiled crittenden sheet

'''


def process_csv():

    with open('raw_data/crittenden-v2.csv', 'r', encoding='utf-8-sig') as f:
        read_file = list(csv.reader(f))

        businesses = []

        for line in read_file[1:]:
            business_dict = dict(zip(read_file[0], line))
            processed_dict = process_dict(business_dict)

            if processed_dict['contacts'] == '':
                # This is a completely empty line
                continue

            if 'Business Name' in processed_dict:
                # if we still have the regular business name, then this is a contact only dictionary. Let's add to the most recently
                # added business. Will throw error if no business beforehand.
                businesses[-1]['contacts'].append(processed_dict['contacts'][0])
                continue

            # if we haven't been weeded out yet, we then add the business
            businesses.append(processed_dict)

    for business in businesses:
        process_business(business)

    # compare_businesses(businesses)
    # for item in businesses:
    #     print("{}- length of contacts -sqft: {}-  {}\n".format(item['brand_name'], item['typical_squarefoot'], len(item['contacts'])))


def process_business(business):
    """
    Build brand from crittenden list.
    """

    brand_name = business["brand_name"]
    brand = create_places_brands.most_relevant_brand(brand_name)

    if not brand:
        brand = business
        # object already includes:
        # brand_name, parent_company, headquarters_city, typical_property_type, typical_squarefoot,  description,
        # and regions_present
        brand['alias'] = business['brand_name']
        brand['logo'] = None
        brand['headquarters_address'] = None
        brand['domain'] = None
        brand['number_locations'] = None
        brand['number_found_locations'] = None
        brand['average_popularity'] = []
        brand['average_price'] = []
        brand['years_operation'] = None
        brand['categories'] = [business['categories']]
        brand['similar_brands'] = []
        brand['average_demographics'] = {}
        brand['average_psychographics'] = {}
        brand['average_sales'] = {}
        brand['contacts'] = {'owners': business['contacts']}
        brand['match_requests'] = {}
    else:
        # if there is an existing brand, let's splice their results together.
        # TODO: add a check for if crittenden has already been updated
        brand['parent_company'] = business['parent_company']
        brand['headquarters_city'] = business['headquarters_city']
        brand['typical_property_type'] = business['typical_property_type']
        brand['typical_squarefoot'] = business['typical_squarefoot']
        brand['description'] = business['description']
        brand['categories'].append(business['categories'])
        brand['contacts'] = {'owners': business['contacts']}
        brand['regions_present'] = business['regions_present']

    if "_id" in brand:
        utils.DB_BRANDS.update({'_id': brand['_id']}, {'$set': brand}, upsert=True)
        brand_id = brand["_id"]
    # otherwise, let's simply inser the new brand and return the id
    else:
        brand_id = utils.DB_BRANDS.insert(brand)

    print(brand_id)


def compare_businesses(businesses):

    count = 0
    for business in businesses:
        most_relevant_brand = create_places_brands.most_relevant_brand(business['brand_name'])
        business['relevant_brand'] = most_relevant_brand['brand_name'] if most_relevant_brand else None
        if not most_relevant_brand:
            count += 1
        print('Business - {} | {}'.format(business['brand_name'], business['relevant_brand']))

    print("{} out of {} businesses did not find a brand.".format(count, len(businesses)))


def process_dict(business_dict):

    business_dict['contacts'] = [
        {
            'name': business_dict.pop('Name'),
            'phone': business_dict.pop('Phone'),
            'email': business_dict.pop('Email')
        }
    ] if 'Name' != '' else ''

    business_dict.pop('Address')
    if business_dict['Business Name'] == '':
        # No need to process remaining sheet if it's empty
        return business_dict

    # process all the fields into fields that are good for our database structure
    business_dict['brand_name'] = business_dict.pop('Business Name').replace("Business Name: ", "")
    business_dict['parent_company'] = business_dict.pop('Parent Company').replace("Parent Company: ", "")
    business_dict['headquarters_city'] = business_dict.pop('Headquarters').replace("Headquarters: ", "")
    business_dict['categories'] = {
        'source': 'Crittenden',
        'categories': [{
            "name": category.strip(),
            "short_name": category.strip()
        } for category in business_dict.pop('Business').split('/')]
    }
    business_dict['typical_property_type'] = {
        'source': 'Crittenden',
        'type': [property_type.strip() for property_type in business_dict.pop('Property').split(',')]
    }
    try:
        business_dict['typical_squarefoot'] = string_to_sqft(business_dict.pop('Floor Plans'))
    except Exception:
        business_dict['typical_squarefoot'] = []
    business_dict['regions_present'] = {
        'regions': [region.strip() for region in business_dict.pop('Territory').split(',')],
        'last_update': datetime.datetime.utcnow().replace(microsecond=0).isoformat()
    }
    business_dict['description'] = business_dict.pop('Notes')

    return business_dict


def string_to_sqft(eval_string):

    if eval_string == '':
        return None
    '''
    Parsing string that looks like XXXX to XXXX s.f. (context here) XXXX to XXXX s.f. (context here) to settings
    '''

    num_match = re.findall(r'(?<!\S)(?=.)(0|([1-9](\d*|\d{0,2}(,\d{3})*)))?(\.\d*[1-9])?(?!\S)', eval_string)
    typical_squarefoot = []

    if len(num_match) <= 2 or '|' in eval_string:
        # If the evaluation string only has less than two numbers, or includes a seperator, the base algorithm
        # will be both more accurate and more consistent.

        # remove trailing seperators, and then seperate using the seperator
        sqft_options = eval_string.strip(' |').split('|')
        for sqft_option in sqft_options:
            # slit the option by the square foot marker
            options = sqft_option.split('s.f.')
            context = None
            if len(options) > 1:
                context = options[1].strip(' ()')

            # split into min and max if there is one
            sqft = [ft.strip() for ft in options[0].split('to')]

            typical_sqft = {
                'min': utils.literal_int(sqft[0]),
                'max': utils.literal_int(sqft[1]) if len(sqft) > 1 else None,
                'context': context
            }

            typical_squarefoot.append(typical_sqft)
    else:
        # if the seperator is not in here, and there are greater than 2 numbers, then base algorithm will struggle
        # regex operator will have a better shot of being more acccurate, though still risky

        # find all the words that are within parantheses and convert all the sqft found earlier into numbers
        context_list = re.findall(r'\(([^\)]+)\)', eval_string)
        sqft_list = [utils.literal_int(number[0]) for number in num_match]

        while len(sqft_list) > 0:
            # assuming that the first context is for the first pair of sqft.
            # snake through lists and add to append list until each is done.
            min_sqft = sqft_list.pop(0)
            max_sqft = None
            if len(sqft_list) > 0 and sqft_list[0] > min_sqft:
                max_sqft = sqft_list.pop(0)

            typical_sqft = {
                'min': min_sqft,
                'max': max_sqft,
                'context': context_list.pop(0) if len(context_list) > 0 else None
            }

            typical_squarefoot.append(typical_sqft)

    return typical_squarefoot


if __name__ == "__main__":
    process_csv()
    pass
