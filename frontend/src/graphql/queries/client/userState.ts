import gql from 'graphql-tag';

export const GET_TIER = gql`
  query GetUserTier {
    userState @client {
      tier
    }
  }
`;

export const GET_BRANDID = gql`
  query GetBrandId {
    userState @client {
      brandId
    }
  }
`;
