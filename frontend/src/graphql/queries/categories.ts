import gql from 'graphql-tag';

export const GET_CATEGORY = gql`
  query getCategory {
    categoryData(input: $input)
      @rest(type: "GetCategoryDataQuery", method: "GET", path: "/category")
  }
`;
