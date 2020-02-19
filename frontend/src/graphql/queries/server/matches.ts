import gql from 'graphql-tag';

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
      maxFrontageWidth
      education {
        displayValue
      }
      commute {
        displayValue
      }
      personas
      equipmentIds
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
