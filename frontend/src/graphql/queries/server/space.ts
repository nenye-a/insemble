import gql from 'graphql-tag';

export const GET_SPACE = gql`
  query GetSpace($spaceId: ID!) {
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
