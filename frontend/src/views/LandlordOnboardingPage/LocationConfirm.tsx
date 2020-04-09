import React, { useState, useEffect, Dispatch } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Button, Form } from '../../core-ui';
import { LocationInput } from '../../components';
import { THEME_COLOR } from '../../constants/colors';
import { MAPS_IFRAME_URL_SEARCH } from '../../constants/googleMaps';
import { FONT_SIZE_NORMAL, FONT_SIZE_LARGE, FONT_WEIGHT_MEDIUM } from '../../constants/theme';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';
import { urlEncode } from '../../utils';
import { SelectedLocation } from '../../components/LocationInput';
import OnboardingFooter from '../../components/layout/OnboardingFooter';

type Props = {
  dispatch: Dispatch<Action>;
  state: LandlordOnboardingState;
};

export default function LocationConfirm(props: Props) {
  let history = useHistory();
  let { state: landlordOnboardingState, dispatch } = props;
  let { confirmLocation } = landlordOnboardingState;
  let [selectedLocation, setSelectedLocation] = useState<SelectedLocation | undefined>(
    confirmLocation?.physicalAddress
  );
  let [isDisabled, setIsDisabled] = useState(true);
  let propertyAddress =
    selectedLocation?.address || confirmLocation?.physicalAddress?.address || '';
  let mapURL = confirmLocation ? MAPS_IFRAME_URL_SEARCH + '&q=' + urlEncode(propertyAddress) : '';

  useEffect(() => {
    if (selectedLocation) {
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
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, dispatch, selectedLocation]);

  let saveFormState = () => {
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
        },
      },
    });
  };
  let handleSubmit = () => {
    if (selectedLocation) {
      history.push('/landlord/new-property/step-3');
    }
  };
  return (
    <Form
      onSubmit={() => {
        handleSubmit();
      }}
      style={{ flex: 1 }}
    >
      <Iframe src={mapURL} />
      <FormContainer flex>
        <TitleText>Is this your property?</TitleText>
        <RowedView>
          <LocationInput
            label="Property Name"
            defaultValue={selectedLocation?.address || ''}
            onPlaceSelected={(location) => setSelectedLocation(location)}
            disabled={isDisabled}
            containerStyle={{ flex: 1 }}
          />
          <EditButton
            text="Edit"
            onPress={() => {
              setIsDisabled(!isDisabled);
            }}
          />
        </RowedView>
      </FormContainer>
      <OnboardingFooter>
        <TransparentButton
          mode="transparent"
          text="Back"
          onPress={() => {
            saveFormState();
            history.goBack();
          }}
          disabled={!selectedLocation}
        />
        <Button type="submit" text="Next" disabled={!selectedLocation} />
      </OnboardingFooter>
    </Form>
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

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;

const TitleText = styled(Text)`
color: ${THEME_COLOR}
  font-size: ${FONT_SIZE_LARGE}
  font-weight: ${FONT_WEIGHT_MEDIUM}
`;
