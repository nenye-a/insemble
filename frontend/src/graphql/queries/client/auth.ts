import gql from 'graphql-tag';

export const SAVE_TENANT_LOGIN = gql`
  mutation LoginSuccess($tier: String!, $trial: Boolean!) {
    loginSuccess(tier: $tier, trial: $trial) @client
  }
`;
