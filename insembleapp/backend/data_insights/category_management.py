from mongo_connect import Connect

def organize_sort_categories():
    """
    Method sorts categories present in the database and organizes them in the database
    :return:
    """

    client = Connect.get_connection()
    db_space = client.spaceData.dataset2
    db_category = client.spaceData.categories

    db_space_cursor = db_space.find({})

    categories = {}
    for item in db_space_cursor:

        # take the categories from the database. Nearby stores are ignored due to potential for repeats
        place_type = item["Retailer"]["place_type"]

        for category in place_type:
            try:
                categories[category] += 1
            except:
                categories[category] = place_type[category]

    inserted = db_category.insert_many([{
            "name": category,
            "occurrence": categories[category]
        } for category in categories]
    ).inserted_ids

    print("{} values inserted to database!".format(len(inserted)))

    return

def pull_categories(number_length=None):

    client = Connect.get_connection()
    db_category = client.spaceData.categories

    # sort and limit our categories
    if number_length:
        db_category_cursor = db_category.find({}).sort("occurrence", -1).limit(number_length)
    else:
        db_category_cursor = db_category.find({}).sort("occurrence", -1)

    return [category["name"] for category in db_category_cursor]



if __name__ == '__main__':
    # organize_sort_categories()
    print(pull_categories())
