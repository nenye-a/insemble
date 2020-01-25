from main import place_validator, detail_builder
import threading

if __name__ == "__main__":

    validator = threading.Thread(target=place_validator, args=({
        'aggregate_type': 'type'
    },))

    builder = threading.Thread(target=detail_builder)

    validator.start()
    builder.start()

    # place_validator({
    #     'aggregate_type': 'type'
    # })
