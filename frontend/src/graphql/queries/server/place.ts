import gql from 'graphql-tag';

export const PLACE = gql`
  query Place($address: String!) {
    place(address: $address) {
      id
      formattedAddress
      name
      location {
        lat
        lng
      }
      viewport {
        northeast {
          lat
          lng
        }
        southwest {
          lat
          lng
        }
      }
    }
  }
`;
