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
        trial
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
          trial
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
          title
          description
          trial
        }
      }
    }
  }
`;

export const LOGIN_LANDLORD = gql`
  mutation LoginLandlord($email: String!, $password: String!) {
    loginLandlord(email: $email, password: $password) {
      token
      landlord {
        id
        email
        firstName
        lastName
        avatar
        company
        title
        description
        trial
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

export const REGISTER_LANDLORD_INVITATION = gql`
  mutation RegisterLandlordInvitation($password: String!, $invitationCode: String!) {
    registerLandlordInvitation(password: $password, invitationCode: $invitationCode) {
      token
      landlord {
        id
        email
        firstName
        lastName
        avatar
        company
        title
        description
        trial
      }
    }
  }
`;

export const REGISTER_TENANT_INVITATION = gql`
  mutation RegisterTenantInvitation($password: String!, $invitationCode: String!) {
    registerTenantInvitation(password: $password, invitationCode: $invitationCode) {
      token
      brandId
      tenant {
        id
        email
        firstName
        lastName
        avatar
        company
        description
        title
        tier
        pendingEmail
        stripeCustomerId
        trial
      }
    }
  }
`;
