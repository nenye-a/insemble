# Data Testing Folder

#### Overview

This folder serves as both a test ground for new scripts that will go into the backend, as well as a home
for all the functions that are used to aggregate data from other sources for the application.

#### Tree

List of directories:

```
data_testing
├── api                             # functions to access external APIs
├── data_aggregator                 # functions to aggregate data for internal platform use
│   └── archive                     # archive of old or out of date aggregator functions
├── matching                        # directory for all matching related functions
│   ├── algorithmic                 # algorithmic based matching explorations
│   │   └── archive                 # archive of algorithmic matching functions
│   └── learning                    # machine learning based matching related functions
│       └── archive                 # archive of machine learning related functions
└── scripts                         # home for miscellaneous scripts to parse and modify data that has been acquired
    └── raw_data                    # raw data to be parsed through scripting help with scripting

Important files withing data_testing folder:

utils.py                            # file that hosts all the utility functions, please keep up to date with '/backend/data/utils.py'
mongo_connect.py                    # file that manages the connection to MongoDB database
```

#### Expectations

- Please make sure the route all external API access through the API folder. Please try to keep this folder as aligned to the 'backend/data/api' folder as posisble.
- If previous items are stale, either delete them or store them in archive for later reference.
- Please keep data files such as .csv, .txt, .json, .pickle, etc. in either the raw_data folder or the scripting_data folder.
- Ensure that 'utils.py' is kept up to date with 'backend/data/utils.py'
