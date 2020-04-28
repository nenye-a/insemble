import gql from 'graphql-tag';

export const GET_USER_STATE = gql`
  query GetUserState {
    userState @client {
      tier
      trial
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
