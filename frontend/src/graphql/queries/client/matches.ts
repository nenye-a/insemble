import gql from 'graphql-tag';

export const GET_LOCATION_PREVIEW_ERROR = gql`
  {
    errorState {
      locationPreview @client
    }
  }
`;
