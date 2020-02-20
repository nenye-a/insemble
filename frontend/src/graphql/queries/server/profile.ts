import gql from 'graphql-tag';

export const PROFILE_TENANT = gql`
  query ProfileTenant {
    profileTenant {
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
