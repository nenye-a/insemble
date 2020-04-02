import gql from 'graphql-tag';

export const GET_PROPERTY_MATCHES_DATA = gql`
  query PropertyMatches($propertyId: String!, $spaceId: String!) {
    propertyMatches(propertyId: $propertyId, spaceId: $spaceId) {
      brandId
      matchId
      pictureUrl
      name
      category
      numExistingLocations
      matchValue
      interested
      contacts {
        name
        email
        phone
        role
      }
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
      maxSize
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
        propertyId
        spaceId
        address
        rent
        sqft
        type
        spaceId
        spaceCondition
        tenantType
        pro
        visible
        lat
        lng
        matchValue
      }
      matchingLocations {
        match
        lng
        lat
      }
    }
  }
`;
