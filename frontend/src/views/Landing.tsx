import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Text, View, ContainedTextInput as TextInput } from '../core-ui';
import Title from './LandingPage/Title';
import Masthead from './LandingPage/Masthead';
import LocationsInput from './LandingPage/LocationsInput';
import useGoogleMaps from '../utils/useGoogleMaps';
import { WHITE } from '../constants/colors';
import { FONT_SIZE_LARGE } from '../constants/theme';
import CategoriesInput from './LandingPage/CategoriesInput';
import Button from '../core-ui/Button';
import asyncStorage from '../utils/asyncStorage';

function Landing() {
  let { isLoading } = useGoogleMaps();
  let history = useHistory();
  useEffect(() => {
    let token = asyncStorage.getTenantToken();
    let brandId = asyncStorage.getBrandId();
    if (token && brandId) {
      history.push('./map/' + brandId);
    }
  }, [history]);

  return (
    <Masthead>
      <RowView>
        <LogIn
          mode="secondary"
          text="Log In"
          textProps={{ style: { color: WHITE } }}
          onPress={() => {
            history.push('/login');
          }}
        />
        <Button
          text="Sign Up"
          onPress={() => {
            history.push('/signup');
          }}
        />
      </RowView>
      <Title style={{ maxWidth: 580 }}>Find the next best location for your business</Title>
      <Text color={WHITE} fontSize={FONT_SIZE_LARGE}>
        I have an existing location
      </Text>
      {isLoading ? (
        <TextInput placeholder="Loading..." disabled={true} />
      ) : (
        <LocationsInput
          placeholder="Enter the address of your top performing restaurant or store"
          buttonText="Find locations"
          onSubmit={(place: google.maps.places.PlaceResult) => {
            let { geometry, formatted_address: formattedAddress, name, place_id: placeID } = place;
            if (geometry) {
              let { location } = geometry;
              if (location) {
                let { lat, lng } = location;
                let latitude = lat();
                let longitude = lng();
                history.push(`/verify/${placeID}`, {
                  placeID,
                  name,
                  formattedAddress,
                  lat: latitude.toString(),
                  lng: longitude.toString(),
                });
              }
            }
          }}
        />
      )}
      <BottomContainer>
        <Text color={WHITE} fontSize={FONT_SIZE_LARGE}>
          Exploring a new restaurant or retail concept
        </Text>
        <CategoriesInput />
      </BottomContainer>
    </Masthead>
  );
}

export default Landing;

const BottomContainer = styled(View)`
  margin-top: 12px;
`;
const RowView = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  position: absolute;
  top: 16px;
  right: 32px;
`;
const LogIn = styled(Button)`
  margin: 0 12px 0 0;
  border-color: ${WHITE};
  background-color: transparent;
`;
