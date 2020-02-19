import gql from 'graphql-tag';

export const PROFILE_TENANT = gql`
  query ProfileTenant {
    tenantUser {
      id
      avatar
      email
      firstName
      lastName
      company
      description
      title
      tier
    }
  }
`;
