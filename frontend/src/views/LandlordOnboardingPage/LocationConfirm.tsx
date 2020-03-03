import React, { useState, useEffect, Dispatch } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, RadioGroup, Text, Label, Button, Form } from '../../core-ui';
import { LocationInput } from '../../components';
import { THEME_COLOR } from '../../constants/colors';
import { MAPS_IFRAME_URL_SEARCH } from '../../constants/googleMaps';
import { FONT_SIZE_NORMAL } from '../../constants/theme';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';
import { urlEncode } from '../../utils';
import { SelectedLocation } from '../../components/LocationInput';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { MarketingPreference } from '../../generated/globalTypes';

type Props = {
  dispatch: Dispatch<Action>;
  state: LandlordOnboardingState;
};

type MarketingPreferenceRadio = {
  label: string;
  value: MarketingPreference;
};

const MARKETING_PREFERENCE_OPTIONS: Array<MarketingPreferenceRadio> = [
  {
    label: 'Public — I want to publicly advertise my property to matching tenants.',
    value: MarketingPreference.PUBLIC,
  },
  {
    label:
      'Private — I want to connect with matching tenants without publicly listing my property.',
    value: MarketingPreference.PRIVATE,
  },
];

export default function LocationConfirm(props: Props) {
  let history = useHistory();
  let { state: landlordOnboardingState, dispatch } = props;
  let { confirmLocation } = landlordOnboardingState;
  let [selectedMarketingPreference, setSelectedMarketingPreference] = useState<
    MarketingPreferenceRadio
  >(MARKETING_PREFERENCE_OPTIONS[0]);
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
            marketingPreference: selectedMarketingPreference.value,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValid, dispatch, selectedLocation, selectedMarketingPreference]);

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
          marketingPreference: selectedMarketingPreference.value,
        },
      },
    });
  };
  let handleSubmit = () => {
    if (allValid) {
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
        <Label text="Marketing Preference" />
        <RadioGroup<MarketingPreferenceRadio>
          name="Marketing Preference"
          options={MARKETING_PREFERENCE_OPTIONS}
          selectedOption={selectedMarketingPreference}
          onSelect={(item) => {
            setSelectedMarketingPreference(item);
          }}
          radioItemProps={{ style: { marginTop: 9 } }}
          titleExtractor={(item: MarketingPreferenceRadio) => item.label}
        />
      </FormContainer>
      <OnboardingFooter>
        <TransparentButton
          mode="transparent"
          text="Back"
          onPress={() => {
            saveFormState();
            history.goBack();
          }}
          disabled={!allValid}
        />
        <Button type="submit" text="Next" disabled={!allValid} />
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
