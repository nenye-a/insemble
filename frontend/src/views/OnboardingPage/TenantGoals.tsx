import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, FieldError } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {
  RadioGroup,
  Label,
  View,
  TextInput,
  MultiSelectLocation,
  Text,
  Button,
  Form as BaseForm,
  LoadingIndicator,
} from '../../core-ui';
import { useGoogleMaps, validateNumber } from '../../utils';
import { NewLocationPlan, NewLocationPlanObj } from '../../reducers/tenantOnboardingReducer';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { FONT_SIZE_SMALL } from '../../constants/theme';
import { RED_TEXT } from '../../constants/colors';
import { LocationInput } from '../../generated/globalTypes';
import { NEW_LOCATION_PLAN_OPTIONS } from '../../constants/locationPlan';
import { TenantOnboardingState } from '../../graphql/localState';
import {
  GET_TENANT_ONBOARDING_STATE,
  UPDATE_TENANT_ONBOARDING,
} from '../../graphql/queries/client/tenantOnboarding';

export default function TenantGoals() {
  let { isLoading } = useGoogleMaps();
  let history = useHistory();
  let { data: onboardingStateData, loading: onboardingStateLoading } = useQuery<
    TenantOnboardingState
  >(GET_TENANT_ONBOARDING_STATE);
  let [updateTenantOnboarding] = useMutation(UPDATE_TENANT_ONBOARDING);

  let [selectedNewLocationPlan, setNewLocationPlan] = useState<NewLocationPlanObj>(
    NEW_LOCATION_PLAN_OPTIONS[0]
  );
  let [selectedLocations, setSelectedLocations] = useState<Array<LocationInput>>([]);
  let hasFillLocations = selectedLocations.length > 0;
  let { watch, errors, register, triggerValidation } = useForm();
  let locationCount = watch('locationCount');
  let locationInputError = errors?.locationCount;
  let allValid =
    selectedNewLocationPlan.value === NewLocationPlan.YES
      ? locationCount && !locationInputError && selectedLocations.length > 0
      : true;

  useEffect(() => {
    if (onboardingStateData) {
      let {
        newLocationPlan: { label, value },
      } = onboardingStateData.tenantOnboardingState.tenantGoals;
      setNewLocationPlan({ label, value });
    }
  }, [onboardingStateData]);

  useEffect(() => {
    triggerValidation('locationCount');
  }, [locationCount, triggerValidation]);

  let saveFormState = async () => {
    await updateTenantOnboarding({
      variables: {
        tenantGoals: {
          newLocationPlan: selectedNewLocationPlan,
          location: selectedLocations.map((item) => ({ ...item, __typename: 'LocationInput' })),
          locationCount: locationCount || 0,
        },
      },
    });
  };

  let onSubmit = () => {
    if (allValid) {
      saveFormState();
      history.push('/verify/step-3');
    }
  };

  if (onboardingStateData) {
    let { locationCount, location } = onboardingStateData.tenantOnboardingState.tenantGoals;
    return (
      <Form onSubmit={onSubmit}>
        <Content flex>
          <Label
            text="Are you planning to open new locations within the next year?"
            id="new-location-plan"
          />
          <RadioGroup
            name="new-location-plan"
            options={NEW_LOCATION_PLAN_OPTIONS}
            selectedOption={selectedNewLocationPlan}
            onSelect={(item) => {
              setNewLocationPlan(item);
            }}
            radioItemProps={{ style: { marginTop: 9 } }}
            style={{ marginBottom: 12 }}
            titleExtractor={(item: NewLocationPlanObj) => item.label}
          />

          {selectedNewLocationPlan.value === NewLocationPlan.YES && (
            <>
              {!isLoading && (
                <FieldContainer>
                  <Label text="Where will you open your locations? (Cities, regions, or counties)" />
                  <MultiSelectLocation
                    onSelected={(values: Array<LocationInput>) => {
                      setSelectedLocations(values);
                    }}
                    defaultSelected={location}
                  />
                  {selectedLocations.length === 0 && (
                    <ErrorMessage>Please provide a location</ErrorMessage>
                  )}
                </FieldContainer>
              )}
              {hasFillLocations && (
                <LocationsNumberInput
                  label="How many locations do you expect to open in the next 2 years?"
                  name="locationCount"
                  defaultValue={locationCount}
                  ref={register({
                    required: 'Please indicate the number locations',
                    validate: (val) => validateNumber(val) || 'Invalid number of locations',
                  })}
                  errorMessage={(errors?.locationCount as FieldError)?.message || ''}
                  containerStyle={{ paddingTop: 12, paddingBottom: 12 }}
                />
              )}
            </>
          )}
        </Content>
        <OnboardingFooter>
          <TransparentButton
            text="Back"
            mode="transparent"
            type="submit"
            onPress={() => history.goBack()}
          />
          <Button text="Next" disabled={!allValid} type="submit" />
        </OnboardingFooter>
      </Form>
    );
  } else if (onboardingStateLoading) {
    return <LoadingIndicator flex />;
  }
  return null;
}

const Form = styled(BaseForm)`
  flex: 1;
`;

const Content = styled(View)`
  padding: 24px 48px;
`;

const LocationsNumberInput = styled(TextInput)`
  width: 42px;
`;

const ErrorMessage = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  color: ${RED_TEXT};
`;

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;

const FieldContainer = styled(View)`
  padding: 12px 0;
`;
