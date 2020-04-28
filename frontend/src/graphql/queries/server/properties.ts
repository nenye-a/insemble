import gql from 'graphql-tag';

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($property: PropertyInput!, $space: CreateSpaceInput!) {
    createProperty(property: $property, space: $space)
  }
`;

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      propertyId
      name
      businessType
      exclusive
      userRelations
      location {
        id
        address
        lng
        lat
      }
      locked
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
        spaceType
        marketingPreference
        tier
      }
    }
  }
`;

export const DELETE_PROPERTY = gql`
  mutation DeleteProperty($propertyId: String!) {
    deleteProperty(propertyId: $propertyId)
  }
`;

export const EDIT_PROPERTY = gql`
  mutation EditProperty($property: PropertyInput!, $propertyId: String!) {
    editProperty(property: $property, propertyId: $propertyId)
  }
`;

export const GET_PROPERTY = gql`
  query Property($propertyId: String!) {
    property(propertyId: $propertyId) {
      id
      propertyId
      name
      businessType
      exclusive
      userRelations
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
        spaceType
        marketingPreference
      }
    }
  }
`;
