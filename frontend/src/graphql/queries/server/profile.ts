import gql from 'graphql-tag';

export const GET_TENANT_PROFILE = gql`
  query GetTenantProfile {
    profileTenant {
      id
      email
      firstName
      lastName
      avatar
      company
      description
      title
      tier
      trial
      pendingEmail
      stripeSubscriptionId
    }
  }
`;

export const EDIT_TENANT_PROFILE = gql`
  mutation EditTenantProfile($profile: EditProfileInput!) {
    editProfileTenant(profile: $profile) {
      id
      email
      firstName
      lastName
      avatar
      company
      description
      title
      pendingEmail
    }
  }
`;

export const EDIT_LANDLORD_PROFILE = gql`
  mutation EditLandlordProfile($profile: EditProfileInput!) {
    editProfileLandlord(profile: $profile) {
      id
      email
      firstName
      lastName
      avatar
      company
      description
      title
      pendingEmail
    }
  }
`;

export const GET_LANDLORD_PROFILE = gql`
  query GetLandlordProfile {
    profileLandlord {
      id
      email
      firstName
      lastName
      avatar
      company
      description
      title
      pendingEmail
      trial
    }
  }
`;
