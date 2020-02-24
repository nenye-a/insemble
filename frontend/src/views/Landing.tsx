import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { Text, View, ContainedTextInput as TextInput, TouchableOpacity, Avatar } from '../core-ui';
import Title from './LandingPage/Title';
import Masthead from './LandingPage/Masthead';
import LocationsInput from './LandingPage/LocationsInput';
import useGoogleMaps from '../utils/useGoogleMaps';
import { WHITE } from '../constants/colors';
import { FONT_SIZE_LARGE } from '../constants/theme';
import CategoriesInput from './LandingPage/CategoriesInput';
import Button from '../core-ui/Button';
import { GetTenantProfile } from '../generated/GetTenantProfile';
import { GET_TENANT_PROFILE } from '../graphql/queries/server/profile';

function Landing() {
  let { isLoading } = useGoogleMaps();
  let history = useHistory();
  let { data } = useQuery<GetTenantProfile>(GET_TENANT_PROFILE, {
    fetchPolicy: 'network-only',
  });
  let avatar = data?.profileTenant.avatar;

  return (
    <Masthead>
      <RowView>
        {data?.profileTenant.id ? (
          <TouchableOpacity
            onPress={() => {
              history.push('/user/edit-profile');
            }}
          >
            <Avatar size="small" image={avatar} />
          </TouchableOpacity>
        ) : (
          <>
            {/* Omitted until the landlord side is ready. */}
            {/* <FindTenantsButton
              text="Landlord Portal"
              mode="transparent"
              onPress={() => {
                history.push('/landlord/signup');
              }}
            /> */}
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
          </>
        )}
      </RowView>
      <Title style={{ maxWidth: 800 }}>
        Find the best locations for your retail or restaurant business
      </Title>
      {/* <Text color={WHITE} fontSize={FONT_SIZE_LARGE}>
        I have an existing location
      </Text> */}
      {isLoading ? (
        <TextInput placeholder="Loading..." disabled={true} />
      ) : (
        <LocationsInput
          placeholder="Enter the address of your top performing location"
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
        {/* <Text color={WHITE} fontSize={FONT_SIZE_LARGE}>
          Exploring a new restaurant or retail concept
        </Text> */}
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

const FindTenantsButton = styled(Button)`
  margin: 0 12px 0 0;
  align-self: center;
  ${Text} {
    color: ${WHITE};
  }
`;

const LogIn = styled(Button)`
  margin: 0 12px 0 0;
  border-color: ${WHITE};
  background-color: transparent;
`;
