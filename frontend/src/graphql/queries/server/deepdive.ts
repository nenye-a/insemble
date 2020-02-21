import gql from 'graphql-tag';

export const GET_LOCATION_DETAILS = gql`
  query locationDetails(
    $brandId: String!
    $selectedLocation: LocationInput
    $selectedPropertyId: String
  ) {
    locationDetails(
      brandID: $brandId
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
      propertyDetails {
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
      }
    }
  }
`;
