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
