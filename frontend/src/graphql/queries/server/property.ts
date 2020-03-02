import gql from 'graphql-tag';

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($property: PropertyInput, $space: SpaceInput) {
    createProperty(property: $property, space: $space)
  }
`;
