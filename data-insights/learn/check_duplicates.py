import math


def encode_list(list):

    encoded_list = 0

    for i, item in enumerate(list):

        # encode our list
        encoded_list += math.pow(item+i, 1.1)

    return encoded_list


def check_duplicates(data_set):

    vectors = {}
    duplicate_count = 0
    no_duplicates = True

    for index, row in data_set.iterrows():
        row = encode_list(list(row))
        try:
            # check if we've seen this before!
            vectors[row]
            vectors[row].append(index)
            no_duplicates = False
            duplicate_count += 1
        except KeyError:
            vectors[row] = [index]

    return no_duplicates, duplicate_count, vectors

def is_in_df(r, data_set):

    r = encode_list(list(r))

    for index, row in data_set.iterrows():
        row = encode_list(list(row))
        if row == r:
            return True

    return False
