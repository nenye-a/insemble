'''
This file represents the organization of the datastructure that's represented in mongodb. This will
cover the required fields, as well as some usefull fields for each type, but there may be additional
items that are present as extra information to be used later.
'''

# BRANDS -> hosted in appData.brands [a.k.a. DB_BRANDS] (currently called brand_details) # TODO: migrate to brands
'''

Brands are claimed or validated retailers that are present on the website. These are retailers/restaurants 
with profiles that have either been pre-populated by the Insemble team, or that have been claimed by users.
These should always be unique, and enforced for uniqueness.

Indexes:
- _id                   (unique)
- brand_name            (unique)
- domain                (unique - this is a suggestion, but will not be immediately implemented)

Brands:
{
    _id: ObjectId(),                                    -> mongodb ID identifying this brand
    brand_name: string,                                 -> name identifying this brand
    alias: string,                                      -> visible alias for the brand (not unique)
    logo: string (url),                                 -> url that paths to the logo of this brand
    parent_company: string,                             -> parent company of the brand
    headquarters_address: string,                       -> address of the headquarters of this brand
    headquarters_city: string,                          -> city headquarters of this brand (we will have this more than the address)
    domain: string (url),                               -> domain name of the brand that is present
    typical_squarefoot: {                               -> typical square footage of the user
        min: int,                                       -> typical minimum square footage
        max: int                                        -> typical maximum square footage
    },
    typical_property_type: [                            -> typical property_type of this brand
        {
            type: list[string],                         -> actual types
            source: string,                             -> source of property types
        }
    ],
    number_locations: int,                              -> number of locations in totality
    number_found_locations: int,                        -> number of locations that are actually in the database
    average_popularity: [                               -> document tracking the average popularity of this location 
        {
            last_update: ISODate(),                     -> last update of this popularity metric
            rating: float,                              -> actual rating value of this establishment
            user_ratings_total: int,                     -> number of user ratings provided.
            source: string,                             -> source of the user ratings data [google, yelp, foursquare, etc.]
        },
        ... more popularity metrics
    ],
    average_price: [
        {
            last_update: ISODate(),                     -> last update of price
            price_level: int,                           -> price level of the establishment
            source: string,                             -> source of the pricing information
            priced_locations: int                       -> the number of locations that have an assigned price
        }
    ],
    years_operation: int,
    description: string,
    categories: [                                       -> list of subcategories and their sources
        {
            categories: [                               -> list of categories for the source
                {
                    name: string,                       -> long name of the category
                    short_name: string,                 -> short name of the category
                }
                ... more categories
            ],
            source: string                              -> source of the cagegory, typically google, foursquare, or yelp
        }
        ... more categories
    ],   
    similar_brands: list[ObjectId()],                   -> brands similar to this brand
    average_demographics: {                             # TODO: flesh out average demographics
    },
    average_psychographics: {                           # TODO: flesh out average psychographics
    },
    annual_sales: [
        {
            last_update: ISODate(),
            year: string,                               -> year of update YYYY
            average_sales_value: float,                  -> average sales across all the locations
            # median_sales_value: float,                 -> median sales across all the locations (this will be added later)
            source: string,                             -> source of the sales information
            recorded_sales_locations: string            -> number of locations with recorded sales
        }
        ... more sales
    ],
    contacts: {
        admin: {                                        -> admin of this brand
            admin_id: string,                           -> postgres ID of the admin of this brand
            name: string,
            role: string,                               -> professional role of the user (added here for matching / sparseness purposes)
        }
        owners: [                                       -> users who are marked as owners of the platform
            {
                user_id: string,                        -> postgres ID of the user
                name: string,                           -> name of the user associated with the brand
                role: string,                           -> professional role of the user
            },
            ... more owners
        ],
        representatives: [                              -> users who are marked as representatives of this brand
            {
                user_id: string,                        -> postgres ID of the user
                name: string,                           -> name of the user associated with the brand
                role: string,                           -> professional role of the user 
            },
            ... more representatives
        ]
    },
    match_requests: {                                   -> all the requests for matches related to this brand
        active: {                                       -> the match schema that is currently active for the brand (perhaps enable different strategies for different regions)
            last_update: ISODate(),
            creator_id: string,
            type: string,
            matches: [
                {
                    region_id: ObjectId(),              -> ID of the region of matches
                    matches_id: ObjectId(),             -> ID of the matches document in DB_LOCATION_MATCHES
                },
                ... more matches
            ] 
        },
        historical: [                                   -> historical matches generated by folks within your brand
            {
                creator_id: string,                     -> postgres Id of user who initialy created this request
                time_stamp: ISODate(),                  -> time of match request
                type: string,                           -> type of matching that was done
                matches: [
                    {
                        region_id: ObjectId(),          -> ID of the region of matches
                        matches_id: ObjectId(),         -> ID of the matches document in DB_LOCATION_MATCHES
                    },
                    ... more matches
                ],
            },
            ... more historical matches
        ],
        other: [                                        -> histoical matches geneated by foks outside of your brand
            {
                creator_id: string,                     -> postgres Id of user who initialy created this request
                time_stamp: ISODate(),                  -> time of match request
                type: string,                           -> type of matching that was done
                matches: [
                    {
                        region_id: ObjectId(),          -> ID of the region of matches
                        matches_id: ObjectId(),         -> ID of the matches document in DB_LOCATION_MATCHES
                    },
                    ... more matches
                ],
            },
            ... more other matches
        ]
    }
}

'''

# PLACES -> hosted in appData.places [a.k.a. DB_PLACES] (currently covered in spaceData.spaces) # TODO: miograte to places
'''

Places are actual locations of brands that have been mapped. These places have all the characteristics that
describe an actual location, including the ratings, reviews, and performance of the business if known.

Indexes:
- _id                   (unique)
- google_place_id       (unique)
- location              (2D spherical index - mongoDB)
- brand_id              

Places:
{
    _id: ObjectId(),                                    -> mongodb ID identifying the location
    location_id: ObjectId(),                            -> mongodb ID identifying the location of this brand in DB_LOCATIONS
    brand_id: ObjectId(),                               -> mongodb ID identifying the brand of this place if known
    google_place_id: string,                            -> place_id provided by google to identify this place
    location: {                             
        type: "Point",                                  -> GEOJson type, should always be point
        coordinates: [                                  -> coordinates of the location
            int,                                        -> longitude of place location
            int                                         -> latitude of place location
        ],
    }                 
    address: string,                                    -> address of this location
    address_components: [                               -> components of the address broken down into components
        {
            long_name: string,                          -> long name of the address component 
            short_name: string,                         -> short name of the address component
            types: list[string]                         -> type of address component this is
        },
        ... other address components
    ]
    name: string,                                       -> name of this place
    annual_sales: [                                     -> annual sales generated by the place
        {
            last_update: ISODate(),                     -> time when the last update was made
            year: string,                               -> year of sales YYYY
            value: float,                               -> value of sales (in $)
            source: string                              -> source of the sales value
        },
        ... more sales updates
    ],
    property_id: ObjectId(),                            -> id of property that this place belongs to (if it has one )
    popularity: [                                       -> document tracking the popularity of this location 
        {
            last_update: ISODate(),                     -> last update of this popularity metric
            rating: float,                              -> actual rating value of this establishment
            user_ratings_total: int,                     -> number of user ratings provided.
            source: string,                             -> source of the user ratings data [google, yelp, foursquare, etc.]
            reviews: []                                 # TODO: flesh out the reviews
        },
        ... more popularity metrics
    ],
    price: [
        {
            last_update: ISODate(),                     -> last update of price
            price_level: int,                           -> price level of the establishment
            source: string                              -> source of the pricing information
        }
    ]
    photos: {
        main: url_string,                               -> link to the main photo of this place  
        other: list[url_string]                         -> list of links to the other photos of this place
    },
    opening_hours: [                                    -> opening hours of the location
        {
            open: {
                day: int,                               -> day of the week, with 0 (monday) -> 6 (sunday)
                time: string                            -> opening time as string in military time (24 hour time)
            }
            close: {
                day: int,                               -> day of the week, with 0 (monday) -> 6 (sunday)
                time: string                            -> opening time as string in military time (24 hour time)
            }
        }
        ... other days
    ],
    website: string,                                    -> website of this site
    description: string,                                -> description of this location
    categories: [                                       -> list of subcategories and their sources
        {
            categories: [                               -> list of categories for the source
                {
                    name: string,                       -> long name of the category
                    short_name: string,                 -> short name of the category
                }
                ... more categories
            ],
            source: string                              -> source of the cagegory, typically google, foursquare, or yelp
        }
    ]                            
}

'''

# LOCATIONS -> hosted in appData.locations [a.k.a. DB_LOCATIONS] (currently called spaceData.spaces) # TODO: migrate to locations
'''

Locations represent geo-spatial points within a location. These points contain all the location based information
that is utilized within the application. Brands and properties refer to these locations to obtain the data that
they then present back to the client.

Indexes:
- _id                   (unique)
- location              (2D spherical index - mongoDB)

Location:
{
    _id: ObjectID(),
    location: {
        type: "Point",                                  -> GEOJson type, should always be point
        coordinates: [                                  -> coordinates of the location
            int,                                        -> longitude of place location
            int                                         -> latitude of resturant location
        ],
    },
    nearby_store: [                                     -> all the nearby stores for this location (returned by google) # TODO: determine if still necessary
        {
            lat: float,                                 -> latitude of the place
            lng: float,                                 -> longitude of the place
            distance: float,                            -> distance from place to location
            place_id: ObjectId(),                       -> ObjectID of place in the places database
            google_place_id: string,                    -> google place_id of this location
            categories: list[string],                   -> categories of the location
        }
        ... many more
    ],
    nearby_restaurant: [                                -> all the nearby restaurants in the area (within 1 mile)
        ... same as nearby_store
    ],
    nearby_hospital: [                                  -> all the nearby hospitals in the area (within 1 mile)
        ... same as nearby_store
    ],
    nearby_church: [                                    -> all the nearby churches in the area (within 1 mile)
        ... same as nearby_store
    ],
    nearby_university: [                                -> all the nearby universities in the area (within 1 mile)
        ... same as nearby_store
    ],
    nearby_apartments: [                                -> all the nearby apartments in the area (within 1 mile)
        ... same as nearby_store
    ],
    spatial_psychographics: {                           -> the key psychographic details 
        1mile: Object(),                                -> psychographic object (psychographic: value)
        3mile: Object(),                                -> psychographic object (psychographic: value)
        5mile: Object(),                                -> psychographic object (psychographic: value)
    },
    environics_demographics: {                          -> the demographics from environics analytics
        1mile: Object(),                                -> demographic object (demographic: value)
        3mile: Object(),                                -> demographic object (demographic: value)
        5mile: Object(),                                -> demographic object (demographic: value)
    },
    arcgis_demographics: {                                 -> the demographics from arcgis 
        1mile: Object(),                                -> demographic object (demographic: value)
        3mile: Object(),                                -> demographic object (demographic: value)
        5mile: Object(),                                -> demographic object (demographic: value)
    },
    block: string,                                      -> string representing the block of this location
    blockgroup: string,                                 -> string representing the blockgroup of this location
    tract: string,                                      -> string representing the tarct of this location
    region: list[ObjectId]                              -> list of regions that this location falls into.
}

'''

# LOCATION MATCHES -> hosted in appData.location_matches [a.k.a. DB_LOCATION_MATCHES] (currently called appData.tenantdetails) # TODO: migrate to matches
'''

Location matches represent viable locations returned from the submission of retail parameters within a specific region.
Matches contain the context of the match request (whether multiple locations where used, the requested parameter
weights, the id of the requestor, etc.). Matches will have a match value associated to the ids of locations within
the region of the match.

Match request parameters could included:
- single location similarity                (implemented)
- multi-location similarity                 (pending)
- learned evaluation                        (in development)
- pure density                              (pending)
- rent similarity                           (pending)

Indexes:
- _id                   (unique)

Location Matches:
{
    _id: ObjectId(),                                    -> mongoDB ID of this match record
    region_id: ObjectId(),                              -> region that this match covers  
    type: string,                                       -> type of match request that this was
    params: {
        ... varies significantly based on type          # TODO: document the parameters that influence location matches
    },
    match_values: {                                     -> dictionary containing the match value of all the 
        <string(location_id)>: int,
        ... many more location_id to int pairs
    }
}

'''

# PROPERTIES & SPACES -> hosted in appData.properties [a.k.a. DB_PROPERTY] (currently called property_details) # TODO: migrate to properties
'''

Properties are claimed or validated properties that are present on the website. These are generated by property
owners who sign up to the platform. Properties must contain atleast one space. Spaces within a proprty contain
all the contextual information that will be used to do property based matches.

Indexes:
- _id                   (unique)
- address               (unique)
- location              (2D spherical index - mongoDB)

Properties:
{
    _id: ObjectId(),                                    -> mongodb ID of this property
    location_id: ObjectId(),                            -> mongodb ID of the location that this property is in
    address: string,                                    -> address of the property in question
    location: {
        type: "Point",                                  -> GEOJson type, should always be point
        coordinates: [                                  -> coordinates of the location
            int,                                        -> longitude of place location
            int                                         -> latitude of resturant location
        ],
    },
    logo: string (url),                                 -> logo of the owner of the property if there is own
    owning_organization: string,                        -> name of the organization that owns this property
    property_type: list[string],                        -> type of property this is
    target_tenant_categories: list[string],             -> target tenant categories for this property
    exclusives: list[string],                           -> the tenant types that this property has exclusivse against
    spaces: [
        {
            space_id: ObjectId(),                       -> mongodb Id of the space                
            space_condition: list[string],              -> condition of the space, typically white box, 2nd generation restaurant, etc.
            tenant_type: list[string],                  -> type of tenant that this space can actgually serve
            asking_rent: int,                           -> asking rent that the landlord would like for the property
            sqft: int,                                  -> square footage of the space
            divisiable: string,                         -> whether the space can be potentially divided
            dibisible_sqft: list[int]                   -> a list of the potential square footage the space can be split into
            pro: boolean,                               -> whether or not the space is under the pro plan or not
            visibile: boolean,                          -> whether or not the space is visible or not
            media: {                                    -> a location of all the media associated with the space
                photos: {
                    main: url_string,                   -> link to the main photo of this place  
                    other: list[url_string]             -> list of links to the other photos of this place
                },
                tour: url_string (matterport)
            },
        }
        ... other spaces
    ],
    contacts: {
        admin: {                                        -> admin of this brand
            admin_id: string,                           -> postgres ID of the admin of this brand
            name: string,
            role: string,                               -> professional role of the user
        }
        owners: [                                       -> users who are marked as owners of the platform
            {
                user_id: string,                        -> postgres ID of the user
                name: string,                           -> name of the user associated with the brand
                role: string,                           -> professional role of the user
            },
            ... more owners
        ],
        representatives: [                              -> users who are marked as representatives of this brand
            {
                user_id: string,                        -> postgres ID of the user
                name: string,                           -> name of the user associated with the brand
                role: string,                           -> professional role of the user
            },
            ... more representatives
        ],
    },
}

'''

# BRAND-SPACE MATCHES -> hosted in appData.brand_space_matches [a.k.a. DB_BRAND_SPACE]
'''

Hosts a match between a retailer and a space. Each document will hold the space to retailer match in addition
to the link to the location match that the match is currently hosted under. There can be multiple using the same
brand and space _id, but there can only be one that's considered activate for the brand. Each of these documents
will be linked to the initiated location search.

Indexes:
- _id                   (unique)            

Brand-space matches:
{
    _id: ObjectId(),                                    -> mongodb id of the match object
    last_update: ISODate(),                             -> date when this match was generated
    location_match_id: ObjectId()                       -> ID of the location match that this leverages
    brand_id: ObjectId(),                               -> mongodb id of the brand thats been matched
    space_id: ObjectId(),                               -> mongodb id of the space thats been matched   
    active: boolean,                                    -> whether or not this is the activate brand to space match
    match_values: {                                     -> the actual match values between the space and the brand
        overall: int,
        location: int,
        space_fit: int,
        rent_fit: int,
        ... any additional match values
    }
}
'''

# REGIONS -> hosted in appData.regions [a.k.a. DB_REGIONS]
'''

Hosts the different regions of matches as designated by Insemble team. This will include all the block regions and their supporting
data.

Indexes:
- _id                   (unique)
- name                  (unique)
- location              (2D spherical index - mongoDB)
- geometry              (2D spherical index - mongoDB)

Region:
{
    _id: ObjectId(),                                    -> mongodb ID of the region
    type: string,                                       -> type of region this is (typically block, blockgroup, tract, county, or city)
    location: {
        type: "Point",                                  -> GEOJson type, should always be point for location
        coordinates: [                                  -> coordinates of the location
            int,                                        -> longitude of the region location centroid
            int                                         -> latitude of the region location centroid
        ],
    },
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                int,                                    -> longitude of the polygon vertex
                int,                                    -> latitude of the polygon vertex
            ]
            ... many more
        ],
    }
    name: string,                                       -> name of the region as known publically (is a number if its for a census block etc.)
    I_number: string,                                   -> interanl number for the region
    environics_demographics: {                          -> environics analytics data for the entire region (applies mostly to block and blockgroup)
        ... all the environics analytics data
    },
    spatial_psychographics: {                           -> spatial.ai psychographics for the entire region (applies mostly to block and blockgroup)
        ... all the psychographics data
    },
}

'''
