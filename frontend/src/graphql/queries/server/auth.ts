import gql from 'graphql-tag';

export const SIGN_UP = gql`
  mutation SignUp(
    $tenant: TenantRegisterInput!
    $business: BusinessRegisterInput
    $filter: FilterInput
  ) {
    registerTenant(tenant: $tenant, business: $business, filter: $filter) {
      token
      tenant {
        id
        email
        firstName
        lastName
        avatar
        company
        tier
      }
    }
  }
`;
