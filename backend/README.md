# Insemble Python Backend

#### Overview

This is the python backend that takes supports the applications access to analytics and insights. This backend also serves as the direct access to the mongodb database. In the future, we may want to switch over to doing direct mongo to front end connection. However as of today, this is managed through this service.

#### Structure

```
backend
├── backend-archive           # archive for old backend folders
├── common                    # common folder for any django apps needed in the platform
│   ├── management            # management folder for django commands
│   │   └── commands          # shell commands definition, primarily related to celery
│   └── utils                 # django utilities including tests (currently heavily neglected)
├── data                      # main directory for accessing the key data of the application (closely related to data_testing)
│   └── api                   # house of all external facing API functions (closely related to data_testing/api)
├── feedback                  # (Outdated) Django app for processing user feedback
│   └── migrations            # host of django migrations related to feedback
├── insembleapp               # main django app that supports aall insemble functions
│   ├── types                 # (Deprecated) types folder for temporary matching, pending deletion
│   └── settings              # main directory for app-wide django settings
└── templates                 # application html templates (actual main host of the website)
    ├── includes              # html inclusions for sentry tracking
    └── insembleapp           # main html for insemble

Important Directory Files

- manage.py                     # Main run file command to kick off django requests

Deeper look into 'backend/insembleapp'

insembleapp
├── celery.py                 # Main config file for celery (aside from settings folder options)
├── landlord_api.py           # API functions leveraged for the landlord side of the platform
├── landlord_serializers.py   # Data serializers used for API functions
├── legacy_api.py             # (Depracated) legacy API functions that are pending testing for archive
├── legacy_serializers.py     # (Depracated) legacy API serializers that are pending testing for archive
├── tenant_api.py             # API functions leveraged for the tenant side of the platform
├── tenant_serializers.py     # Primary serializer for the tenant side of the platform
├── settings                    
│   ├── base.py               # Base Django settings (feeds into both local and production settings)
│   ├── local.py              # local settings file (inherits from local_base.py)
│   ├── local.py.example      # example of local settings file
│   ├── local_base.py         # base local files that should be leveraged for local runs
│   ├── production.py         # base production settings that should be leveraged in production
│   └── test.py               # (Deprecated) test settings, pending deletion
├── urls.py                   # Main host of URLS for Django endpoints.
├── views.py                  # Host for custom views
└── wsgi.py                   # Host for wsgi process manager for django
```

#### Running Backend

In order to run the backend:
1. Run `python manage.py runserver` - This will kick off the base server process.
2. Ensure that you have a local redis server process running. Download redis to your local system home and ensure that it runs. (instructions in root directory).
3. Run `python manage.py celery` - This will kick off the celery process.

#### API development

All API's developed within this project are done using [Djano Rest Framework](https://www.django-rest-framework.org) (a.k.a. drf). To develop an API function, please follow that documentation. Here's an overview on creating one.

In order to develop a new API endpoint for the django app, please follow the following steps.

1. Add API view function to either the landlord or tenant API files.
2. Ensure that you have correct serializers set up and connected to your API.
3. Write API function methods following class based or function based Django Rest.
4. Ensure that the desired url for the api is includedin the urls.py file within the `url_patterns` list. The structure for urls within the list either follow a `path` or `url` structure depending on whether or not you want to add keys to the url path. Example - `url(r'api/propertyTenants/', PropertyTenantAPI.as_view(), name='propertyTenants')` or `path(r'api/properties/<slug:_id>/', SearchAPI.as_view(), name='properties'),` where the path allows us to us the key `'_id'` in our API function.

