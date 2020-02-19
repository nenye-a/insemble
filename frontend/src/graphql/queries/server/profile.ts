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
    }
  }
`;

export const EDIT_TENANT_PROFILE = gql`
  mutation EditTenantProfile($profile: EditProfileTenantInput!) {
    editProfileTenant(profile: $profile) {
      id
      email
      firstName
      lastName
      avatar
      company
      description
      title
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
    }
  }
`;
