import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Button, Text } from '../../core-ui';
import { MultiSelectBox, LocationInput } from '../../components';
import { SelectedLocation } from '../../components/LocationInput';

import { WHITE, HEADER_BORDER_COLOR } from '../../constants/colors';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { Categories } from '../../generated/Categories';
import { TenantMatchesContext } from '../MainMap';

type PlaceResult = google.maps.places.PlaceResult;

type Props = {
  address?: string;
  categories?: Array<string>;
  onPublishChangesPress?: () => void;
  publishButtonDisabled?: boolean;
  onAddressSearch?: (selectedLocation: SelectedLocation) => void;
};

export default function HeaderFilterBar(props: Props) {
  let {
    categories,
    onPublishChangesPress,
    publishButtonDisabled,
    address,
    onAddressSearch,
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
        <AddressContainer>
          {address ? <Text>{`My Address: ${address}`}</Text> : null}
        </AddressContainer>
      </RowedView>
    </Container>
  );
}

// const PROPERTY_TYPES = ['Available', 'Recommended'];

const Row = styled(View)`
  flex-direction: row;
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
  padding: 6px 0;
`;

const CategorySelector = styled(MultiSelectBox)`
  margin-right: 8px;
`;
