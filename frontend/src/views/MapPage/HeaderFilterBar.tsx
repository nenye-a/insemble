import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Button, Text } from '../../core-ui';
import { MultiSelectBox } from '../../components';

import { WHITE, HEADER_BORDER_COLOR } from '../../constants/colors';
// import Legend from '../MapPage/Legend';
// import TextInput from '../../core-ui/ContainedTextInput';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { Categories } from '../../generated/Categories';
import { TenantMatchesContext } from '../MainMap';

type PlaceResult = google.maps.places.PlaceResult;

type Props = {
  address?: string;
  categories?: Array<string>;
  onPublishChangesPress?: () => void;
  publishButtonDisabled?: boolean;
};

export default function HeaderFilterBar(props: Props) {
  let { categories, onPublishChangesPress, publishButtonDisabled, address } = props;
  // let [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('Recommended');
  let [selectedOptions, setSelectedOptions] = useState<Array<string>>(categories || []);
  let { data: categoryData, loading: categoryLoading } = useQuery<Categories>(GET_CATEGORIES);
  let { onCategoryChange } = useContext(TenantMatchesContext);

  let inputRef = useRef<HTMLInputElement | null>(null);
  let selectedPlace = useRef<PlaceResult | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      let autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      let listener = autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        selectedPlace.current = place;
      });
      return () => {
        listener.remove();
      };
    }
  }, []);

  // let submitHandler = () => {
  //   if (selectedPlace.current) {
  //     onAddressChange && onAddressChange(selectedPlace.current);
  //   }
  // };

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
        </Row>
        <View>{address ? <Text>{`My Address: ${address}`}</Text> : null}</View>
      </RowedView>

      {/* <LocationInputContainer flex>
        <LocationInput
          icon
          ref={inputRef}
          placeholder={'Search an address or retailer'}
          onSubmit={submitHandler}
          className="search-box"
        />
      </LocationInputContainer> */}
      {/* <Legend /> */}
    </Container>
  );
}

// const PROPERTY_TYPES = ['Available', 'Recommended'];

const Row = styled(View)`
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled(RowedView)`
  padding: 12px 32px;
  z-index: 1;
  background-color: ${WHITE};
  box-shadow: 0px 1px 1px 0px ${HEADER_BORDER_COLOR};
  position: sticky;
  top: 0px;
`;

const UpdateMapButton = styled(Button)`
  margin-left: 8px;
`;

// we should remove this styling later when dropdown and legend are ready
// const LocationInputContainer = styled(View)`
//   align-items: center;
//   margin-left: -20%;
// `;

// const LocationInput = styled(TextInput)`
//   width: 343px;
//   height: 36px;
//   border: solid;
//   border-width: 1px;
//   margin-left: 8px;
//   align-self: center;
// `;

const CategorySelector = styled(MultiSelectBox)`
  margin-right: 8px;
`;
