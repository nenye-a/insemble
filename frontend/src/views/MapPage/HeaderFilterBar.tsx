import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Button, Text, Divider } from '../../core-ui';
import { MultiSelectBox, LocationInput } from '../../components';
import { SelectedLocation } from '../../components/LocationInput';
import { TenantMatchesContext } from '../MainMap';

import { WHITE, HEADER_BORDER_COLOR, LIGHTER_GREY, BLACK } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';

import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { Categories } from '../../generated/Categories';
import currentLocationIcon from '../../assets/images/current-location-marker.svg';

type PlaceResult = google.maps.places.PlaceResult;

type Props = {
  address?: string;
  categories?: Array<string>;
  onPublishChangesPress?: () => void;
  publishButtonDisabled?: boolean;
  onAddressSearch?: (selectedLocation: SelectedLocation) => void;
  brandName?: string | null;
};

export default function HeaderFilterBar(props: Props) {
  let {
    categories,
    onPublishChangesPress,
    publishButtonDisabled,
    address,
    onAddressSearch,
    brandName,
  } = props;
  // let [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('Recommended');
  let [selectedOptions, setSelectedOptions] = useState<Array<string>>([]);
  let { data: categoryData, loading: categoryLoading } = useQuery<Categories>(GET_CATEGORIES);
  let { onCategoryChange } = useContext(TenantMatchesContext);

  useEffect(() => {
    if (categories) {
      setSelectedOptions(categories);
    }
  }, [categories]);

  let setTagSelected = (tag: string, selected: boolean) => {
    let newSelectedOptions = selectedOptions;
    if (selected) {
      newSelectedOptions = selectedOptions.filter((item) => item !== tag);
    } else {
      newSelectedOptions = [...selectedOptions, tag];
    }
    setSelectedOptions(newSelectedOptions);
  };

  return (
    <Container>
      <RowedView flex>
        <Row>
          <CategorySelector
            selectedOptions={selectedOptions}
            options={categoryData?.categories || []}
            onSelect={(item: string) => {
              setTagSelected(item, false);
            }}
            onUnSelect={(item: string) => {
              setTagSelected(item, true);
            }}
            placeholder="Select Category"
            onClear={() => setSelectedOptions([])}
            onPickerClose={() => {
              onCategoryChange && onCategoryChange(selectedOptions);
            }}
            loading={categoryLoading}
          />
          {/* <Dropdown
          options={PROPERTY_TYPES}
          selectedOption={selectedDropdownValue}
          onSelect={(newValue: string) => setSelectedDropdownValue(newValue)}
        /> */}
          <UpdateMapButton
            text="Update Map"
            onPress={onPublishChangesPress}
            disabled={publishButtonDisabled}
          />
          <LocationInput
            icon
            placeholder="Search for something on the map"
            onPlaceSelected={onAddressSearch}
            className="search-box"
            containerStyle={{ paddingLeft: 20, width: 340 }}
          />
        </Row>
        {address && (
          <Row>
            <Text>Showing Results For:</Text>
            <AddressContainer>
              <Icon src={currentLocationIcon} />
              <BrandName>{brandName}</BrandName>
              <Divider mode="vertical" />
              <Address>{address}</Address>
            </AddressContainer>
          </Row>
        )}
      </RowedView>
    </Container>
  );
}

// const PROPERTY_TYPES = ['Available', 'Recommended'];

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 6px 0;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Container = styled(Row)`
  padding: 6px 32px;
  z-index: 1;
  background-color: ${WHITE};
  box-shadow: 0px 1px 1px 0px ${HEADER_BORDER_COLOR};
`;

const UpdateMapButton = styled(Button)`
  margin-left: 8px;
`;

const AddressContainer = styled(View)`
  padding: 6px;
  flex-direction: row;
  width: 400px;
  background-color: ${LIGHTER_GREY};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  margin-left: 8px;
`;

const BrandName = styled(Text)`
  align-self: center;
  width: fit-content;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 8px;
  color: ${BLACK};
`;

const Address = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-self: center;
  padding-left: 8px;
  max-width: 300px;
  color: ${BLACK};
`;

const CategorySelector = styled(MultiSelectBox)`
  margin-right: 8px;
`;

const Icon = styled.img`
  padding-right: 8px;
`;
