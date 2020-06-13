import pandas as pd

def is_phone(item):
    if not isinstance(item, str):
        return False
    num_digits = 0
    for c in item:
        if c.isdigit():
            num_digits += 1
        if num_digits >= 10 and len(item) <30:
            return True
    return False

def is_US_city(item):
    if isinstance(item, str) and "United States" in item:
        return True
    return False

def populate_info(table):
    contacts = []
    for i in range(len(table)):
        new_contact = False
        if is_US_city(table[i]):
            if isinstance(table[i-2], str) and "MEETING ATTENDANCE" in table[i-2]:
                continue
            address = table[i-1]
            city = table[i]
        elif is_phone(table[i]):
            phone = table[i]
            try:
                ctype = table[i+1]
                name = table[i+2]
                role = table[i+3]
                company = table[i+4]
            except Exception:
                break
            new_contact = True
        if new_contact:
            try:
                contacts[-1] = contacts[-1] + [address, city, phone, ctype]
            except Exception:
                pass
            contacts.append([name, role, company])

    return contacts

def parseICSCdoc(filepath):
    file = pd.read_csv(filepath)
    table_list = file.values.tolist()
    table = [x[0] for x in table_list]
    contacts = populate_info(table)
    contacts_df = pd.DataFrame(contacts, columns=['Name', 'Title', 'Company', 'Address', 'City', 'Phone', 'Type'])
    contacts_df.to_csv(filepath[:-4]+"_organized.csv")

# def separate_contacted(old, new):
#     uncontacted = set()
#     contacted = set()
#     company_contacted = set()
#     for contact in new:
#         if same:
#             #if the name is the same

#             #if the email is the same

#             #if the phone is the same
#             contacted.add(contact)
#         else if other_same:
#             # or if company is the same
#             company_contacted.add(contact)
#         else:
#             uncontacted.add(contact)

#     return uncontacted, company_contacted, contacted

def check_same_list(name, namelist):
    pass

def check_same(name, otherName):
    pass

if __name__ == "__main__":

    def test_populateinfo():
        file = pd.read_csv('/Users/colin/Downloads/2020_rrs_unprocessed.csv')
        table_list = file.values.tolist()
        table = [x[0] for x in table_list]
        print("unformatted csv lines", len(table))
        contacts = populate_info(table)
        print("parsed contacts", len(contacts))
        contacts_df = pd.DataFrame(contacts, columns=['Name', 'Title', 'Company', 'Address', 'City', 'Phone', 'Type'])
        contacts_df.to_csv('/Users/colin/Downloads/2020_rrs_organized.csv')

    test_populateinfo()
    
    