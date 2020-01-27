from utils import DB_PROCESSED_SPACE

if __name__ == "__main__":
    type_queries = [
        'store', 'restaurant',  # general categories
        'park',  # key entertainment
        'subway_station',  # transportation
        'hospital',  # key services
        'church',  # key religion
        'university',
    ]

    # Types that cannot be queried as a type from google, but can be searched
    search_queries = ['apartments']
    all_queries = type_queries + search_queries

    spaces = DB_PROCESSED_SPACE.find({})

    for space in spaces:
        list_names = [
            'nearby_store'
            'nearby_park'
            'nearby_restaurant'
            'nearby_subway_station'
            'nearby_hospital'
            'nearby_church'
            'nearby_university'
            'nearby_apartments'
        ]

        for name in list_names:
            if name in space:
                if 'nearby_complete' in space:
                    space['nearby_complete'].append(name)
                else:
                    space['nearby_complete'] = [name]

        DB_PROCESSED_SPACE.update_one({'_id': space['_id']}, {'$set': space})
