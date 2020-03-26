import gql from 'graphql-tag';

export const GET_SPACE = gql`
  query GetSpace($spaceId: String!) {
    space(spaceId: $spaceId) {
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
`;

export const EDIT_SPACE = gql`
  mutation EditSpace($space: SpaceInput!, $spaceId: String!) {
    editSpace(space: $space, spaceId: $spaceId)
  }
`;

export const CREATE_SPACE = gql`
  mutation CreateSpace($space: CreateSpaceInput!, $propertyId: String!) {
    createSpace(space: $space, propertyId: $propertyId)
  }
`;
export const DELETE_SPACE = gql`
  mutation DeleteSpace($spaceId: String!) {
    deleteSpace(spaceId: $spaceId)
  }
`;

export const SAVE_SPACE = gql`
  mutation SaveProperty($spaceId: String!, $matchValue: Float!) {
    saveProperty(spaceId: $spaceId, matchValue: $matchValue) {
      spaceId
    }
  }
`;
