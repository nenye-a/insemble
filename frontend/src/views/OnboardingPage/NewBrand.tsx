import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { TextInput, View, Text, Button } from '../../core-ui';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { useGoogleMaps } from '../../utils';
import LocationsInput from '../LandingPage/LocationsInput';
import OnboardingCard from './OnboardingCard';
import { DARK_TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_NORMAL, FONT_WEIGHT_BOLD } from '../../constants/theme';

export default function NewBrand() {
  let { isLoading } = useGoogleMaps();
  let history = useHistory();

  return (
    <Container flex>
      <OnboardingCard title="Submit another brand." progress={0}>
        <ContentContainer>
          {isLoading ? (
            <TextInput placeholder="Loading..." disabled={true} />
          ) : (
            <LocationsInput
              label="Please provide representative address:"
              placeholder="Enter the name or address of your top performing location"
              onSubmit={(place: google.maps.places.PlaceResult) => {
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
                }
              }}
              buttonProps={{
                text: 'Find locations',
                size: 'small',
                style: { top: 7 },
              }}
              style={{ height: 42, fontSize: FONT_SIZE_NORMAL }}
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
        </ContentContainer>
        <OnboardingFooter>
          <TransparentButton text="Back" mode="transparent" onPress={() => history.goBack()} />
        </OnboardingFooter>
      </OnboardingCard>
    </Container>
  );
}

const NoAddressButton = styled(Button)`
  align-self: flex-end;
  ${Text} {
    color: ${DARK_TEXT_COLOR};
    font-weight: ${FONT_WEIGHT_BOLD};
  }
`;
const Container = styled(View)`
  align-items: center;
  margin: 24px;
`;

const ContentContainer = styled(View)`
  padding: 24px 48px;
  z-index: 1;
  flex: 1;
`;

const TransparentButton = styled(Button)`
  padding: 0 12px;
`;
