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
