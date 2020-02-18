import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { View, Dropdown, Button } from '../../core-ui';
import { MultiSelectBox } from '../../components';

import { session } from '../../utils/storage';
import { WHITE, HEADER_BORDER_COLOR } from '../../constants/colors';
import urlSafeLatLng from '../../utils/urlSafeLatLng';
import { useDispatch, useSelector, useStore } from '../../redux/helpers';
import { getLocation, loadMap } from '../../redux/actions/space';
import Legend from '../MapPage/Legend';
import TextInput from '../../core-ui/ContainedTextInput';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { Categories } from '../../generated/Categories';
import { TenantMatchesContext } from '../MainMap';

type PlaceResult = google.maps.places.PlaceResult;

type Props = {
  categories?: Array<string>;
};

export default function HeaderFilterBar(props: Props) {
  let [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('Recommended');
  let [selectedOptions, setSelectedOptions] = useState<Array<string>>(props.categories || []);
  let { data: categoryData, loading: categoryLoading } = useQuery<Categories>(GET_CATEGORIES);
  let { onFilterChange } = useContext(TenantMatchesContext);
  let { getState } = useStore();
  let history = useHistory();
  let dispatch = useDispatch();
  let locationLoaded = useSelector((state) => state.space.locationLoaded);
  let [submittingPlace, setSubmittingPlace] = useState<string | null>(null);
  let inputRef = useRef<HTMLInputElement | null>(null);
  let selectedPlace = useRef<PlaceResult | null>(null);

  useEffect(() => {
    if (locationLoaded === true) {
      let placeID = submittingPlace;
      // TODO: Using dispatch/getState like this is kinda messy.
      loadMap(true)(dispatch, getState);
      history.push(`/verify/${placeID}`);
    }
  }, [locationLoaded, dispatch, getState, history, submittingPlace]);

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

  let onSubmit = (place: PlaceResult) => {
    let placeID = place.place_id || '';
    let address = place.formatted_address || '';
    session.set(['place', placeID], place);
    session.set('sessionStoreName', place.name);
    session.set('sessionAddress', address);
    session.remove('sessionIncome');
    session.remove('sessionTags');
    let location = place.geometry ? place.geometry.location.toJSON() : null;
    if (location) {
      let { lat, lng } = urlSafeLatLng(location);
      // TODO: Using dispatch like this is kinda messy.
      getLocation(`/api/location/lat=${lat}&lng=${lng}&radius=1/`)(dispatch);
      setSubmittingPlace(placeID);
    }
  };

  let submitHandler = () => {
    if (selectedPlace.current) {
      onSubmit(selectedPlace.current);
    }
  };

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
      <RowedView>
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
            onFilterChange({ categories: selectedOptions });
          }}
          loading={categoryLoading}
        />
        <Dropdown
          options={PROPERTY_TYPES}
          selectedOption={selectedDropdownValue}
          onSelect={(newValue: string) => setSelectedDropdownValue(newValue)}
        />
        <SaveButton text="Publish Changes" />
      </RowedView>
      <LocationInputContainer
        icon
        ref={inputRef}
        placeholder={'Search an address or retailer'}
        onSubmit={submitHandler}
      />
      <Legend />
    </Container>
  );
}

const PROPERTY_TYPES = ['Available', 'Recommended'];

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Container = styled(RowedView)`
  padding: 12px 32px;
  z-index: 1;
  background-color: ${WHITE};
  box-shadow: 0px 1px 1px 0px ${HEADER_BORDER_COLOR};
  justify-content: space-between;
  position: sticky;
  top: 0px;
`;

const SaveButton = styled(Button)`
  margin-left: 8px;
`;

const LocationInputContainer = styled(TextInput)`
  width: 343px;
  height: 36px;
  border: solid;
  border-width: 1px;
  margin-left: 8px;
`;

const CategorySelector = styled(MultiSelectBox)`
  margin-right: 8px;
`;
