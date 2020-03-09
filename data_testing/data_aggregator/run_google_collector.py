from main import place_collector_google, place_collector_google_brute
import threading

if __name__ == "__main__":
    bounds = {
        'nw': (34.345681, -118.667468),
        'se': (33.421557, -117.458284)
    }

    def plain_google():

        place_collector_google(34.045350, -118.251384, 'restaurant',
                               'second_google', bounds, run_record=None)

    def brute_google_down(lat, lng, type_, name):
        # place_collector_google_brute(34.280217, -118.617003, type_,
        #                              name, bounds, run_record=None, direction='down')

        place_collector_google_brute(lat, lng, type_,
                                     name, bounds, run_record=None, direction='down')

    def brute_google_up():
        pass
        # Details need to be changed to work upwards
        # place_collector_google_brute(34.280217, -118.617003, 'restaurant',
        #                              'first_brute_google', bounds, run_record=None, direction='up')

    restaurant_thread = threading.Thread(
        target=brute_google_down, args=(34.2272067, -118.6566156, 'restaurant', 'goog_restaurant_brute_3'))
    store_thread = threading.Thread(
        target=brute_google_down, args=(34.2272067, -118.6566156, 'store', 'goog_store_brute_3'))

    restaurant_thread.start()
    store_thread.start()
