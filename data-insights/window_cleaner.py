#from smart_search import *
# initiate database collections
# from mongo_connect import Connect
from location_builder import *
import math
import statistics as stat

def update_database_age(dataset):
    # iterate through dataset 2

    retailers_checked = set()
    cursor = dataset.find()
    for entry in cursor:
        name = entry['name']
        # check if each entry has createdAt
        try:
            entry['age']
        except Exception:
            l, r, age, p, pp, ps, v = get_performance(name, entry['lat'], entry['lng'])
            dataset.update_one({'_id': entry['_id']}, {'$set': {"age": age}})

        retailers_checked.add(name)

def update_database_photo(dataset):
    # iterate through dataset 2

    retailers_checked = set()
    cursor = dataset.find()
    count = 0
    for entry in cursor:
        if count % 250 == 0:
            print("processed {} entries".format(count))
        name = entry['name']
        # check if each entry has photo
        try:
            entry['photo']
            entry['icon']
        except Exception:
            format_input = urllib.parse.quote(entry['name']+', '+entry['Location']['address'])
            URL = "https://maps.googleapis.DELETED_BASE64_STRING?input={0}&inputtype=textquery&fields=icon,photos&key={1}".format(
                format_input, GOOG_KEY)
            data = smart_search(URL, 'google', 'findplacefromtext')

            try:
                icon = data['candidates'][0]['icon']
            except Exception:
                print("Error getting icon from name {0}, lat {1} and lng {2}".format(entry['name'], entry['lat'], entry['lng']))
                print(data)
                icon = np.nan

            ##### FIXME: add alternate smart search for photo requests to pull url (regular tries to get .json objects)
            try:
                photo_ref = data['candidates'][0]['photos'][0]['photo_reference']
                URL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&maxheight=500&photoreference={}&key={}'.format(photo_ref, GOOG_KEY)
                data2 = requests.get(URL)
                photo = data2.url
            except Exception:
                print("Error getting photo from name {0}, lat {1} and lng {2}".format(entry['name'], entry['lat'],
                                                                                     entry['lng']))
                print(data)
                photo = np.nan

            dataset.update_one({'_id': entry['_id']}, {'$set': {"icon": icon}})
            dataset.update_one({'_id': entry['_id']}, {'$set': {"photo": photo}})

        retailers_checked.add(name)
        count += 1

if __name__ == "__main__":
    # initiate database collections
    client = Connect.get_connection()
    db = client.spaceData
    dataset2 = db.dataset2

    update_database_photo(dataset2)