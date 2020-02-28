import gql from 'graphql-tag';

export const GET_PROPERTY_MATCHES_DATA = gql`
  query PropertyMatches($propertyId: String!) {
    propertyMatches(propertyId: $propertyId) {
      brandId
      pictureUrl
      name
      category
      numExistingLocations
      matchValue
      interested
      verified
      claimed
      matchesTenantType
      exclusivityRisk
    }
  }
`;

export const GET_TENANT_MATCHES_DATA = gql`
  query TenantMatches($brandId: String!) {
    tenantMatches(brandId: $brandId) {
      name
      location {
        address
        lng
        lat
      }
      userRelation
      locationCount
      nextLocations {
        address
        lng
        lat
      }
      newLocationPlan
      minIncome
      maxIncome
      categories
      minAge
      maxAge
      minSize
      minRent
      maxRent
      minFrontageWidth
      education {
        displayValue
      }
      commute {
        displayValue
      }
      personas
      ethnicity {
        rawValue
        displayValue
      }
      equipment
      spaceType
      matchingProperties {
        address
        rent
        sqft
        type
      }
      matchingLocations {
        match
        lng
        lat
      }
    }
  }
`;
