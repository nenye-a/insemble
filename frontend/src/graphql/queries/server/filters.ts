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

export const GET_COMMUTE_LIST = gql`
  query Commute {
    commute {
      displayValue
    }
  }
`;

export const GET_EDUCATION_LIST = gql`
  query Education {
    education {
      displayValue
    }
  }
`;

export const GET_PROPERTY_TYPE_LIST = gql`
  query SpaceType {
    spaceType
  }
`;

export const GET_AUTOPOPULATE_FILTER = gql`
  query AutoPopulateFilter($address: String, $brandName: String) {
    autoPopulateFilter(address: $address, brandName: $brandName) {
      categories
      personas
      income {
        min
        max
      }
      age {
        min
        max
      }
    }
  }
`;
