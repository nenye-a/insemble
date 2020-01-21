import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Dropdown, Button, Text } from '../../core-ui';
import { session } from '../../utils/storage';
import { WHITE, HEADER_BORDER_COLOR } from '../../constants/colors';
import urlSafeLatLng from '../../utils/urlSafeLatLng';
import { useDispatch, useSelector, useStore } from '../../redux/helpers';
import { getLocation, loadMap } from '../../redux/actions/space';
import Legend from '../MapPage/Legend';
import TextInput from '../../core-ui/ContainedTextInput';

type PlaceResult = google.maps.places.PlaceResult;

export default function HeaderFilterBar() {
  let [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('Recommended');
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

  return (
    <Container>
      <RowedView>
        <Text>Category Selection</Text>
        <Dropdown
          selectedValue={selectedDropdownValue}
          values={PROPERTY_TYPES}
          onItemSelected={(newValue: string) => setSelectedDropdownValue(newValue)}
        />
        <SaveButton text="Save Search" />
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
`;
