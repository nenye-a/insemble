import gql from 'graphql-tag';

export const REGISTER_TENANT = gql`
  mutation RegisterTenant($tenant: TenantRegisterInput!) {
    registerTenant(tenant: $tenant) {
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
    }
  }
`;
