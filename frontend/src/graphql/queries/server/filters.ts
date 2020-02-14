import gql from 'graphql-tag';

export let GET_CATEGORIES = gql`
  query Categories {
    categories
  }
`;
