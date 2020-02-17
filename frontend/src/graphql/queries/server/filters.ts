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

export const GET_EQUIPMENT_LIST = gql`
  query Equipments {
    equipments
  }
`;
