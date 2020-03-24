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
      categories
      userRelations
      businessType
      propertyType
      exclusive
      marketingPreference
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
      businessType
      propertyId
      categories
      exclusive
      location {
        lat
        lng
        address
      }
      marketingPreference
      propertyType
      name
      userRelations
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
