import React, { useState, useEffect, Dispatch } from 'react';
import styled from 'styled-components';

import { View, RadioGroup, Text, Label, Button } from '../../core-ui';
import { LocationInput } from '../../components';
import { THEME_COLOR } from '../../constants/colors';
import { MAPS_IFRAME_URL_SEARCH } from '../../constants/googleMaps';
import { FONT_SIZE_NORMAL } from '../../constants/theme';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';
import { urlEncode } from '../../utils';
import { SelectedLocation } from '../../components/LocationInput';

type Props = {
  dispatch: Dispatch<Action>;
  state: LandlordOnboardingState;
};

export default function LocationConfirm(props: Props) {
  let { state: landlordOnboardingState, dispatch } = props;
  let { confirmLocation } = landlordOnboardingState;
  let [selectedMarketingPreference, setSelectedMarketingPreference] = useState(
    confirmLocation?.marketingPreference || ''
  );
  let [selectedLocation, setSelectedLocation] = useState<SelectedLocation | undefined>(
    confirmLocation?.physicalAddress
  );
  let [isDisabled, setIsDisabled] = useState(true);
  let propertyName = selectedLocation?.name || confirmLocation?.physicalAddress?.name || '';
  let propertyAddress =
    selectedLocation?.address || confirmLocation?.physicalAddress?.address || '';

  let mapURL = confirmLocation
    ? MAPS_IFRAME_URL_SEARCH + '&q=' + urlEncode(propertyName + ', ' + propertyAddress)
    : '';

  let allValid = selectedMarketingPreference && selectedLocation;

  useEffect(() => {
    if (allValid) {
      dispatch({ type: 'ENABLE_NEXT_BUTTON' });
      dispatch({
        type: 'SAVE_CHANGES_CONFIRM_LOCATION',
        values: {
          confirmLocation: {
            ...landlordOnboardingState.confirmLocation,
            physicalAddress: selectedLocation || {
              lat: '',
              lng: '',
              address: '',
              name: '',
              id: '',
            },
            marketingPreference: selectedMarketingPreference,
          },
        },
      });
    } else {
      dispatch({ type: 'DISABLE_NEXT_BUTTON' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValid, dispatch, selectedLocation, selectedMarketingPreference]);

  return (
    <>
      <Iframe src={mapURL} />
      <FormContainer>
        <RowedView flex>
          <LocationInput
            label="Property Name"
            defaultValue={selectedLocation?.address || ''}
            onPlaceSelected={(location) => setSelectedLocation(location)}
            disabled={isDisabled}
          />
          <EditButton
            text="Edit"
            onPress={() => {
              setIsDisabled(!isDisabled);
            }}
          />
        </RowedView>
        <Label text="Marketing Preference" />
        <RadioGroup
          name="Marketing Preference"
          options={[
            'Public — I want to publicly advertise my property to matching tenants.',
            'Private — I want to connect with matching tenants without publicly listing my property.',
          ]}
          selectedOption={selectedMarketingPreference}
          onSelect={(item) => {
            setSelectedMarketingPreference(item);
          }}
          radioItemProps={{ style: { marginTop: 9 } }}
        />
      </FormContainer>
    </>
  );
}

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 240px;
  border: none;
`;

const FormContainer = styled(View)`
  padding: 24px 48px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  margin: 20px 0;
`;

const EditButton = styled(Button)`
  background-color: transparent;
  margin-left: 8px;
  margin-top: 20px;
  height: auto;
  ${Text} {
    color: ${THEME_COLOR};
    font-size: ${FONT_SIZE_NORMAL};
  }
`;
