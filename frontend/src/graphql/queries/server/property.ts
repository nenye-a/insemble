import gql from 'graphql-tag';

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($property: PropertyInput!, $space: CreateSpaceInput!) {
    createProperty(property: $property, space: $space)
  }
`;
