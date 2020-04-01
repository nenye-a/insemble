import gql from 'graphql-tag';

export const GET_LOCATION_DETAILS = gql`
  query LocationDetails(
    $brandId: String!
    $selectedLocation: LocationInput
    $selectedPropertyId: String
  ) {
    locationDetails(
      brandId: $brandId
      selectedLocation: $selectedLocation
      selectedPropertyId: $selectedPropertyId
    ) {
      result {
        matchValue
        affinities {
          growth
          personas
          demographics
          ecosystem
        }
        keyFacts {
          mile
          daytimePop
          mediumHouseholdIncome
          totalHousehold
          householdGrowth2017to2022
          numMetro
          numUniversities
          numHospitals
          numApartements
        }
        commute {
          name
          value
        }
        topPersonas {
          percentile
          name
          description
          tags
          photo
        }
        demographics1 {
          age {
            name
            myLocation
            targetLocation
            growth
          }
          income {
            name
            myLocation
            targetLocation
            growth
          }
          ethnicity {
            name
            myLocation
            targetLocation
            growth
          }
          education {
            name
            myLocation
            targetLocation
            growth
          }
          gender {
            name
            myLocation
            targetLocation
            growth
          }
        }
        demographics3 {
          age {
            name
            myLocation
            targetLocation
            growth
          }
          income {
            name
            myLocation
            targetLocation
            growth
          }
          ethnicity {
            name
            myLocation
            targetLocation
            growth
          }
          education {
            name
            myLocation
            targetLocation
            growth
          }
          gender {
            name
            myLocation
            targetLocation
            growth
          }
        }
        demographics5 {
          age {
            name
            myLocation
            targetLocation
            growth
          }
          income {
            name
            myLocation
            targetLocation
            growth
          }
          ethnicity {
            name
            myLocation
            targetLocation
            growth
          }
          education {
            name
            myLocation
            targetLocation
            growth
          }
          gender {
            name
            myLocation
            targetLocation
            growth
          }
        }

        nearby {
          lat
          lng
          name
          rating
          numberRating
          category
          distance
          placeType
          similar
        }
      }
      spaceDetails {
        spaceId
        tour3D
        mainPhoto
        sqft
        photos
        summary {
          pricePerSqft
          type
          condition
        }
        description
        liked
      }
    }
  }
`;

export const GET_PROPERTY_LOCATION_DETAILS = gql`
  query PropertyLocationDetails($propertyId: String!) {
    propertyDetails(propertyId: $propertyId) {
      keyFacts {
        mile
        daytimePop
        mediumHouseholdIncome
        totalHousehold
        householdGrowth2017to2022
        numMetro
        numUniversities
        numHospitals
        numApartements
      }
      commute {
        name
        value
      }
      topPersonas {
        percentile
        name
        description
        tags
        photo
      }
      demographics1 {
        age {
          name
          myLocation
        }
        income {
          name
          myLocation
        }
        ethnicity {
          name
          myLocation
        }
        education {
          name
          myLocation
        }
        gender {
          name
          myLocation
        }
      }
      demographics3 {
        age {
          name
          myLocation
        }
        income {
          name
          myLocation
        }
        ethnicity {
          name
          myLocation
        }
        education {
          name
          myLocation
        }
        gender {
          name
          myLocation
        }
      }
      demographics5 {
        age {
          name
          myLocation
        }
        income {
          name
          myLocation
        }
        ethnicity {
          name
          myLocation
        }
        education {
          name
          myLocation
        }
        gender {
          name
          myLocation
        }
      }
    }
  }
`;

export const GET_TENANT_DETAILS = gql`
  query TenantDetail($brandId: String!, $propertyId: String!, $matchId: String) {
    tenantDetail(brandId: $brandId, propertyId: $propertyId, matchId: $matchId) {
      name
      category
      keyFacts {
        tenantPerformance {
          storeCount
          rating
          operationYears
          averageReviews
        }
      }
      tenantView {
        overview
        description
        minSqft
        ceilingHeight
        condition
      }
      insightView {
        topPersonas {
          percentile
          name
          description
          tags
          photo
        }
        demographics1 {
          age {
            name
            myLocation
            targetLocation
          }
          income {
            name
            myLocation
            targetLocation
          }
          ethnicity {
            name
            myLocation
            targetLocation
          }
          education {
            name
            myLocation
            targetLocation
          }
          gender {
            name
            myLocation
            targetLocation
          }
        }
        demographics3 {
          age {
            name
            myLocation
            targetLocation
          }
          income {
            name
            myLocation
            targetLocation
          }
          ethnicity {
            name
            myLocation
            targetLocation
          }
          education {
            name
            myLocation
            targetLocation
          }
          gender {
            name
            myLocation
            targetLocation
          }
        }
        demographics5 {
          age {
            name
            myLocation
            targetLocation
          }
          income {
            name
            myLocation
            targetLocation
          }
          ethnicity {
            name
            myLocation
            targetLocation
          }
          education {
            name
            myLocation
            targetLocation
          }
          gender {
            name
            myLocation
            targetLocation
          }
        }
      }
    }
  }
`;
