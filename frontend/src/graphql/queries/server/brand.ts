import gql from 'graphql-tag';

export const CREATE_BRAND = gql`
  mutation CreateBrand($business: BusinessInput, $filter: FilterInput) {
    createBrand(business: $business, filter: $filter)
  }
`;

export const EDIT_BRAND = gql`
  mutation EditBrand($business: BusinessInput, $filter: FilterInput, $brandId: String!) {
    editBrand(business: $business, filter: $filter, brandId: $brandId)
  }
`;

export const GET_BRANDS = gql`
  query GetBrands {
    brands {
      id
      name
      categories
      nextLocations {
        address
        lng
        lat
      }
      matchingLocations {
        match
        lat
        lng
      }
      newLocationPlan
      locationCount
      location {
        address
        lng
        lat
      }
      locked
    }
  }
`;

export const DELETE_BRAND = gql`
  mutation DeleteBrand($brandId: String!) {
    deleteBrand(brandId: $brandId)
  }
`;
