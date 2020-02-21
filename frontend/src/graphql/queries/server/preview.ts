import gql from 'graphql-tag';

export const GET_LOCATION_PREVIEW = gql`
  query LocationPreview(
    $brandId: String!
    $selectedLocation: LocationInput
    $selectedPropertyId: String
  ) {
    locationPreview(
      brandId: $brandId
      selectedLocation: $selectedLocation
      selectedPropertyId: $selectedPropertyId
    ) {
      targetAddress
      targetNeighborhood
      daytimePop3Mile
      medianIncome
      medianAge
    }
  }
`;
