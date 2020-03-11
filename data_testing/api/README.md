# Data Testing API


#### Overview

This folder holds the interface for accessing the underlying data that powers the applcation. The files in this
folder are development or testing versions of the API hosted in the '/backend/data/api' folder. This API is not
an exportable API, and instead an interface for the application to access either data from other APIs or it's
own underlying data.

**Note**: When ready to put an API function in the application, please ensure that the underlying code is placed in the
'backend/data/api' folder.


#### Main APIs

Supported API's
- **Google**: Data on points of interest, geolocation services, and much much more. More detail available at [maps.googleapis.com](https://maps.googleapis.com)
- **Foursquare**: Data on points of interest, including categories, details, and more. More detail available at [developer.foursquare.com/docs](https://developer.foursquare.com/docs/api/endpoints)
- **Texas A&M**: Geocoding functions (paid, true api) - What points are located where according to the census. More detail available at [geoservices.tamu.edu/](https://geoservices.tamu.edu/)
- **Esri Arcgis**: Demographic overview (paid, true api) - Data on people. More detail available at [developers.arcgis.com](https://developers.arcgis.com)
- **Justice Map**: Quick demographics details (free, true api) - Data on people. More detail avaialble at [www.justicemap.org](http://www.justicemap.org)
- **Spatial.ai**: Detailed psychographics (parsed flat file) - Data on how people think and their personas. More detail available at [www.spatial.ai](https://taxonomy.spatial.ai)
- **Environics Analytics**: Detailed demographics (parsed flat file) - Data on people. More detail available at [www.environicsanalytics.com](https://environicsanalytics.com/docs/default-source/us---variable-lists/claritas-pop-facts-advanced-variable-list.pdf)
- **Pitney Bose**: Data on points of interest, specifically sales. More detail available at [locate.pitneybowes.com/docs/](locate.pitneybowes.com/docs/)

#### API Structure

For all files connecting to an external API, please follow the following structure.

```python

# import statements, only include the path addition of data_testing if using higher directory files
import sys
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)  # include data_testing
import utils
from decouple import config  # using decouple to grab key from environment

'''
Description (Example)
'''

API_NAME = 'Name of API'
KEY_EXAMPLE = config('Name of Key')  # Rename to descriptive key name

# Endpoints:
API_ENDPOINT_EXAMPLE = 'https://api.endpoint.base.url/?'  # base url endpoint

# Methods - provide custom parameters, but recommended to include save option to determine need to save in database or not. 
def example_method(param1, param2, save=True):  

    url = API_ENDPOINT_EXAMPLE
    payload = {}
    headers = {}
    params = {}  # process params

    # function using safe request 
    response, _id = safe_request.request(
        API_NAME, "GET", url, headers=headers, data=payload, params=params, api_field='name_of_key_field', safe=save)
    
    # More api logic ~~~~~~~~
```

