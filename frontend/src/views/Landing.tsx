import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/react-hooks';

import { View, ContainedTextInput as TextInput, TouchableOpacity, Avatar, Text } from '../core-ui';
import Title from './LandingPage/Title';
import Masthead from './LandingPage/Masthead';
import LocationsInput from './LandingPage/LocationsInput';
import useGoogleMaps from '../utils/useGoogleMaps';
import { WHITE } from '../constants/colors';
import Button from '../core-ui/Button';
import { GetTenantProfile } from '../generated/GetTenantProfile';
import { GET_TENANT_PROFILE, GET_LANDLORD_PROFILE } from '../graphql/queries/server/profile';
import asyncStorage from '../utils/asyncStorage';
import { GetLandlordProfile } from '../generated/GetLandlordProfile';
import { Role } from '../types/types';

function Landing() {
  let { isLoading } = useGoogleMaps();
  let role = asyncStorage.getRole();
  let history = useHistory();

  let [getTenantProfile, { data: tenantData }] = useLazyQuery<GetTenantProfile>(
    GET_TENANT_PROFILE,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  let [getLandlordProfile, { data: landlordData }] = useLazyQuery<GetLandlordProfile>(
    GET_LANDLORD_PROFILE,
    {
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (role === Role.TENANT) {
      getTenantProfile();
    } else if (role === Role.LANDLORD) {
      getLandlordProfile();
    }
  }, [getTenantProfile, getLandlordProfile, role]);

  let id = tenantData?.profileTenant.id || landlordData?.profileLandlord.id || '';
  let avatar = tenantData?.profileTenant.avatar || landlordData?.profileLandlord.avatar || '';

  return (
    <Masthead>
      <RowView>
        {id ? (
          <TouchableOpacity
            onPress={() => {
              role === Role.TENANT
                ? history.push('/user/edit-profile')
                : history.push('/landlord/edit-profile');
            }}
          >
            <Avatar size="small" image={avatar} />
          </TouchableOpacity>
        ) : (
          <>
            <FindTenantsButton
              text="Landlord Portal"
              mode="transparent"
              onPress={() => {
                history.push('/landlord/signup');
              }}
            />
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
        Find the next best locations for your retail or restaurant business
      </Title>
      {/* <Text color={WHITE} fontSize={FONT_SIZE_LARGE}>
        I have an existing location
      </Text> */}
      {isLoading ? (
        <TextInput placeholder="Loading..." disabled={true} />
      ) : (
        <LocationsInput
          placeholder="Enter the name or address of your top performing location"
          buttonText="Find locations"
          onSubmit={(place: google.maps.places.PlaceResult) => {
            let { geometry, formatted_address: formattedAddress, name, place_id: placeID } = place;
            if (geometry) {
              let { location } = geometry;
              if (location) {
                let { lat, lng } = location;
                let latitude = lat();
                let longitude = lng();
                history.push('/verify/step-1', {
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
      <View>
        <NoAddressButton
          text="Don't have an address?"
          mode="transparent"
          onPress={() => {
            history.push('/verify/step-1', {
              newPlace: true,
            });
          }}
        />
      </View>
      <BottomContainer>
        {/* <Text color={WHITE} fontSize={FONT_SIZE_LARGE}>
          Exploring a new restaurant or retail concept
        </Text> */}
        {/* <CategoriesInput /> */}
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

const NoAddressButton = styled(Button)`
  margin: 0 12px 0 0;
  align-self: flex-end;
  ${Text} {
    color: ${WHITE};
  }
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
