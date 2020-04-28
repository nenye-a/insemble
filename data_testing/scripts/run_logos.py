import utils
import clearbit
import time
clearbit.key = 'sk_9db08b1d17100530fe6623af475af601'

'''
Run file to get logos of all retailers in the database

'''


def run_logos():
    """

    Generates all of the logos for all of the retailers in the database

    """
    # get retailer names sorted by num user ratings overall
    #names = get_unique_names()

    batch_size = {'size': 100}
    # query = {'$or': [{'block': {'$exists': False}}, {'blockgroup': {'$exists': False}}]}
    query = {'logo': {'$exists': False}}

    # print(spaces.count())

    getting_logos = True

    while getting_logos:

        print(
            "**BB - Starting new batch of {}".format(batch_size['size'])
        )
        spaces = utils.DB_PROCESSED_SPACE.aggregate([
            {'$match': query},
            {'$sample': batch_size}
        ])

        for place in spaces:
            name = place['name']

            logo = get_logo(name)

            if not logo:
                print(
                    "**BB - Could not resolve logo for {}".format(name)
                )
                continue

            update = {
                'logo': logo,
            }

            x = utils.DB_PROCESSED_SPACE.update_many({'name': name}, {'$set': update})

            print(
                "**BB - Run Logo: {} documents updated for {} with logo {}".format(x.modified_count, name, logo)
            )


def get_unique_names():
    # get retailer names from database and add to dictionary of names, # reviews
    items = utils.DB_SPACE.spaces.find({}, {"name": 1, "user_ratings_total": 1, "_id": 0})
    # count = 0
    names = {}
    for item in items:
        try:
            names[item["name"]] = names[item["name"]] + item["user_ratings_total"]
        except:
            try:
                names[item["name"]] = item["user_ratings_total"]
            except:
                names[item["name"]] = 0
        # count += 1
        # if count % 2000 == 0:
        #     print("counted", count, "database entries")

    return {k: v for k, v in sorted(names.items(), key=lambda item: item[1], reverse=True)}


def get_logo(inp_name):
    """

    Gets the logo url for a particular restaurant or retail store

    """

    response = clearbit.NameToDomain.find(name=inp_name)
    if response is None:
        return None
    return response["logo"]


if __name__ == "__main__":
    def test_get_names_logos():
        names = get_unique_names()
        print("total entries", len(names))
        names_list = list(names.keys())[:30]
        start = time.time()
        for name in names_list:
            logo = get_logo(name)
            # print(logo)
        print("time lapse", time.time() - start)

        #print("first entry", first_name,names[first_name])
        #print("subway numbers", names["Subway"])

    run_logos()
