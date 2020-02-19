import gql from 'graphql-tag';

export const REGISTER_TENANT = gql`
  mutation RegisterTenant(
    $tenant: TenantRegisterInput!
    $business: BusinessInput
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
      brandId
    }
  }
`;

export const LOGIN_TENANT = gql`
  mutation LoginTenant($email: String!, $password: String!) {
    loginTenant(email: $email, password: $password) {
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
      brandId
    }
  }
`;
