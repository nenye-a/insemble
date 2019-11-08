#from smart_search import *
# initiate database collections
# from mongo_connect import Connect
from location_builder import *
import math
import statistics as stat

def update_database(dataset):
    # iterate through dataset 2

    retailers_checked = set()
    cursor = dataset.find()
    for entry in cursor:
        name = entry['name']
        # check if each entry has createdAt
        try:
            entry['age']
        except Exception:
            l, r, age, p, v = get_performance(name, entry['lat'], entry['lng'])
            dataset.update_one({'_id': entry['_id']}, {'$set': {"age": age}})

        # check if each entry has Retailer: Avg likes, avg ratings
        '''
        commented out b/c locations data just has latitudes
        
        if name in retailers_checked:
            continue
             
        try:
            entry['Retailer']['likes']
            entry['Retailer']['ratings']
        except Exception:
            ## for avg likes and ratings, take retailer name and locations and get venues/details for each of those locations
            ## totalling averages from that search
            total_likes = []
            total_ratings = []
            for location in entry['Retailer']['locations']:
                print(location)
                lat = location[0]
                lng = location[1]

                likes, ratings, a, p, v = get_performance(name, lat, lng)
                total_likes.append(likes)
                total_ratings.append(ratings)

            avg_likes = stat.mean(total_likes)
            avg_ratings = stat.mean(total_ratings)

            dataset.update_one({'_id': entry['_id']}, {'$set': {"Retailer.likes": avg_likes}})
            dataset.update_one({'_id': entry['_id']}, {'$set': {"Retailer.ratings": avg_ratings}})
        '''

        retailers_checked.add(name)

if __name__ == "__main__":
    # initiate database collections
    client = Connect.get_connection()
    db = client.spaceData
    dataset2 = db.dataset2

    update_database(dataset2)