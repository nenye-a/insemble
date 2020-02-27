from decouple import config
import pandas
import clearbit
import safe_request

API_NAME = 'Hunter'
HUNT_KEY = config("HUNT_KEY")
clearbit.key = config("CLEAR_KEY")


# Hunter.io endpoint. Refer to https://hunter.io/api-documentation/v2 for details.
HUNT_EMAIL_ENDPOINT = 'https://api.hunter.io/v2/email-finder?'

def get_domain(inp_name, domain_dict=None):
    """
    Gets the domain url for a particular business name
    """
    if domain_dict is not None:
        try:
            return domain_dict[inp_name]
        except:
            pass

    response = clearbit.NameToDomain.find(name=inp_name)
    if response is None:
        return None
    return response["domain"]

def get_email(first, last, domain):
    url = HUNT_EMAIL_ENDPOINT
    payload = {}
    headers = {}
    params = {
        'api_key': HUNT_KEY,
        'domain': domain,
        'first_name': first,
        'last_name': last
    }

    response, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='key')

    try:
        return response['data']['email']
    except:
        print("Could not resolve email for", first, last, domain, ". Got", response)
        return None

def get_all_emails(path,filename):
    contact_df = pandas.read_csv(path+filename)
    #build domain dict

    domain_dict = None
    new_emails = []
    formatted_companies = []

    #go through all contacts and find emails
    for index, contact in contact_df.iterrows():
        new_email = ""
        formatted_company = ""
        formatted_company += parse_company(contact["Company"])
        formatted_companies.append(formatted_company)
        domain = get_domain(formatted_company, domain_dict)
        if domain is not None:
            first, last = parse_name(contact["Name"])
            email = get_email(first, last, domain)
            if email is not None:
                new_email += email

        new_emails.append(new_email)

        print("updated contact: {} from company {}").format(contact["Name"],formatted_company)

    contact_df.insert(9, "New Email", new_emails, True)
    contact_df.insert(8, "Company Formatted", formatted_companies, True)
    return contact_df.to_csv(path+filename[:-4]+"_emails.csv")

def get_all_emails_domains(path,filename):
    contact_df = pandas.read_csv(path+filename)
    #build domain dict

    domain_dict = build_domain_dict(contact_df)
    new_emails = []
    formatted_companies = []
    domains = []

    #go through all contacts and find emails
    for index, contact in contact_df.iterrows():
        new_email = ""
        formatted_company = ""
        formatted_company += parse_company(contact["Company"])
        formatted_companies.append(formatted_company)
        domain = get_domain(formatted_company, domain_dict)
        if domain is not None:
            first, last = parse_name(contact["Name"])
            email = get_email(first, last, domain)
            if email is not None:
                new_email += email

        new_emails.append(new_email)
        domains.append(domain)

        #print("updated contact: {} from company {}").format(contact["Name"],formatted_company)

    contact_df.insert(9, "New Email", new_emails, True)
    contact_df.insert(10, "Domain", domains, True)
    contact_df.insert(8, "Company Formatted", formatted_companies, True)
    return contact_df.to_csv(path+filename[:-4]+"_emails_domains.csv")

def parse_name(name):
    split_name = name.split(" ")
    first = split_name[0]
    last = ""
    for word in reversed(split_name):
        if ("." not in word) and not word==" " and not word=="" and not word.isupper():
            last = word.replace(",", "")
            break

    return first, last

def parse_company(name):
    name = name.replace(" Inc", "")
    name = name.replace(" Co.", "")
    name = name.replace(" LLC", "")
    name = name.replace(",", "")
    name = name.replace(".", "")

    split_name = name.split(" ")

    #remove spaces
    spaceless = [s for s in split_name if s != ' ']

    return " ".join(spaceless)

def build_domain_dict(df):
    domain_dict = {}
    for i in range(len(df)):
        try:
            domain_dict[parse_company(df["Company"][i])] = df["Email"][i].split("@")[1]
        except:
            pass
    return domain_dict

if __name__ == "__main__":

    def test_get_domain():
        print(get_domain("LBG Real Estate Companies", {"LBG Real Estate Companies":"DGoldman@lbgfunds.com"}))

    def test_get_email():
        print(get_email("David", "Goldman", "lbgfunds.com"))

    def test_get_all_emails():
        print(get_all_emails("C:\\Users\\user\\Downloads\\","test_icsc_contacts.csv"))

    def test_get_all_emails_domains():
        print(get_all_emails_domains("C:\\Users\\user\\Downloads\\","test_icsc_contacts.csv"))

    def test_parse_name():
        print(parse_name("Tanya D. Thomas, CSM"))
        print(parse_name("Colin Webb"))
        print(parse_name("Lucas Nuttall "))

    def test_parse_company():
        print(parse_company("Capital Realty, Inc."))
        print(parse_company("Buckner, Robinson & Mirkovich"))
        print(parse_company("Brixton Capital, LLC"))
        print(parse_company("Marinita Development Co."))
        print(parse_company("The Wendy's Company"))

    def test_build_domain_dict():
        df = pandas.read_csv("C:\\Users\\user\\Downloads\\test_icsc_contacts.csv")
        domain_dict = build_domain_dict(df)
        print(domain_dict)
        print(domain_dict["Evergreen Devco"])
        print(domain_dict["Primestor Development"])

    test_get_email()
