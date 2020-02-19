import gql from 'graphql-tag';

<<<<<<< HEAD
export const PROFILE_TENANT = gql`
  query ProfileTenant {
    profileTenant {
      id
      avatar
      email
      firstName
      lastName
=======
export const GET_TENANT_PROFILE = gql`
  query GetTenantProfile {
    profileTenant {
      email
      firstName
      lastName
      avatar
>>>>>>> connect profile card
      company
      description
      title
      tier
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
