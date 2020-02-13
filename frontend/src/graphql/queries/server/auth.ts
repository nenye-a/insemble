import gql from 'graphql-tag';

export const REGISTER_TENANT = gql`
  mutation RegisterTenant(
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

export const SAVE_TENANT_LOGIN = gql`
  mutation loginSuccess(
    $token: String!
    $email: String!
    $firstName: String!
    $lastName: String!
    $avatar: String
    $company: String
    $tier: String!
    $role: String!
  ) {
    loginSuccess(
      token: $token
      email: $email
      firstName: $firstName
      lastName: $lastName
      avatar: $avatar
      company: $company
      tier: $tier
      role: $role
    ) @client
  }
`;
