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
  query TenantRegisterVerification($id: String!) {
    tenantRegisterVerification(verificationId: $id) {
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

export const LANDLORD_VERIFICATION = gql`
  query LandlordRegisterVerification($id: String!) {
    landlordRegisterVerification(verificationId: $id) {
      id
      verified
      landlordAuth {
        token
        landlord {
          id
          email
          firstName
          lastName
          avatar
          company
          tier
          title
          description
        }
      }
    }
  }
`;

export const REGISTER_LANDLORD = gql`
  mutation RegisterLandlord($landlord: LandlordRegisterInput!) {
    registerLandlord(landlord: $landlord) {
      message
      verificationId
    }
  }
`;
