import gql from 'graphql-tag';

export const CREATE_BRAND = gql`
  mutation CreateBrand($business: BusinessInput, $filter: FilterInput) {
    createBrand(business: $business, filter: $filter)
  }
`;
