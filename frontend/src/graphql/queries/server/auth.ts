import gql from 'graphql-tag';

export const REGISTER_TENANT = gql`
  mutation RegisterTenant(
    $tenant: TenantRegisterInput!
    $business: BusinessInput
    $filter: FilterInput
  ) {
    registerTenant(tenant: $tenant, business: $business, filter: $filter) {
      message
      verificationId
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

export const TENANT_VERIFICATION = gql`
  query TenantVerification($id: String!) {
    tenantVerification(verificationId: $id) {
      verified
      tenantAuth {
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
  }
`;
