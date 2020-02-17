import gql from 'graphql-tag';

export const GET_CATEGORIES = gql`
  query Categories {
    categories
  }
`;

export const GET_PERSONA_LIST = gql`
  query Personas {
    personas
  }
`;
