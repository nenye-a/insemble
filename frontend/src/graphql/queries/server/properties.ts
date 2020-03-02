import gql from 'graphql-tag';

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      propertyId
      name
      categories
      location {
        id
        address
        lng
        lat
      }
      space {
        id
        available
        equipment
        photos
        condition
        sqft
        pricePerSqft
        mainPhoto
        description
      }
    }
  }
`;
