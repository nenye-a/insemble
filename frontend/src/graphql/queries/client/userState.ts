import gql from 'graphql-tag';

export const GET_TIER = gql`
  query GetUserTier {
    userState @client {
      tier
    }
  }
`;
