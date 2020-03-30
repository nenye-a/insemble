import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/react-hooks';

import { View, ContainedTextInput as TextInput, TouchableOpacity, Avatar, Text } from '../core-ui';
import Title from './LandingPage/Title';
import Masthead from './LandingPage/Masthead';
import LocationsInput from './LandingPage/LocationsInput';
import Description from './LandingPage/Description';
import Features from './LandingPage/Features';
import SpeedUpLeasing from './LandingPage/SpeedUpLeasing';
import Footer from './LandingPage/Footer';
import { useGoogleMaps, useCredentials, useViewport } from '../utils';
import Button from '../core-ui/Button';
import { GetTenantProfile } from '../generated/GetTenantProfile';
import { GET_TENANT_PROFILE, GET_LANDLORD_PROFILE } from '../graphql/queries/server/profile';
import { GetLandlordProfile } from '../generated/GetLandlordProfile';
import { Role } from '../types/types';
import InsembleLogo from '../components/common/InsembleLogo';
import { WHITE } from '../constants/colors';
import { VIEWPORT_TYPE } from '../constants/viewports';
import { FONT_SIZE_XXLARGE } from '../constants/theme';
import { Place } from '../generated/Place';
import { GET_PROPERTIES } from '../graphql/queries/server/properties';
import { GET_BRANDS } from '../graphql/queries/server/brand';
import { GetBrands } from '../generated/GetBrands';
import { GetProperties } from '../generated/GetProperties';

type LogoViewProps = ViewProps & {
  isDesktop?: boolean;
};

function Landing() {
  let { isLoading } = useGoogleMaps();
  let { role, landlordToken, tenantToken } = useCredentials();
  let history = useHistory();
  let { viewportType } = useViewport();
  let isDesktop = viewportType === VIEWPORT_TYPE.DESKTOP;

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
  let [getBrand] = useLazyQuery<GetBrands>(GET_BRANDS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      let { id } = data.brands[0];
      history.push(`/map/${id}`);
    },
  });
  let [getProperties] = useLazyQuery<GetProperties>(GET_PROPERTIES, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      let { id } = data?.properties[0];
      history.push(`/landlord/properties/${id}`);
    },
  });

  useEffect(() => {
    if (role === Role.TENANT) {
      if (tenantToken) {
        getBrand();
      }
    } else if (role === Role.LANDLORD) {
      if (landlordToken) {
        getProperties();
      }
    }
  }, [getBrand, getProperties, role]);

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
    <View>
      <Masthead>
        <LogoView isDesktop={isDesktop}>
          <InsembleLogo color="white" size={isDesktop ? 'default' : 'small'} />
        </LogoView>
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
        <Title style={{ maxWidth: 800, ...(!isDesktop && { fontSize: FONT_SIZE_XXLARGE }) }}>
          Find the best location for your retail or restaurant business
        </Title>
        {isLoading ? (
          <TextInput placeholder="Loading..." disabled={true} />
        ) : (
          <LocationsInput
            placeholder="Enter your top retail address"
            buttonText="Go"
            onSubmit={(place) => {
              let {
                geometry,
                formatted_address: formattedAddress,
                name,
                place_id: placeID,
              } = place;
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
              } else {
                let newPlace = (place as unknown) as Place;
                let { location, id, formattedAddress, name } = newPlace.place;
                let { lat, lng } = location;
                history.push('/verify/step-1', {
                  id,
                  name,
                  formattedAddress,
                  lat,
                  lng,
                });
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
      </Masthead>
      <Description />
      <Features />
      <SpeedUpLeasing />
      <Footer />
    </View>
  );
}

export default Landing;

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

const LogoView = styled(View)<LogoViewProps>`
  position: absolute;
  top: ${(props) => (props.isDesktop ? '16px' : '25px')};
  left: 32px;
`;
