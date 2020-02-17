import gql from 'graphql-tag';

export const GET_HEATMAP_DATA = gql`
  query TenantMatches($brandId: String!) {
    tenantMatches(brandId: $brandId) {
      name
      location {
        id
        address
        lat
        lng
      }
      userRelation
      locationCount
      matchingLocations {
        loc_id
        match
        lng
        lat
      }
    }
  }
`;
