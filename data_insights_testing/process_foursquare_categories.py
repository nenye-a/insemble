raw_categories = open('foursquare_categories.txt').readlines()

processed_categories = []
for category in raw_categories:
    is_digit = category[0].isdigit()
    has_incorrect_strings = "icon" in category or "Supported countries" in category
    if not (is_digit or has_incorrect_strings):
        processed_categories.append(category[:-1])


if __name__ == "__main__":
    print(processed_categories)