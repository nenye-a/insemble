import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, FieldError } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  RadioGroup,
  View,
  TextInput,
  MultiSelectLocation,
  Text,
  Button,
  Form as BaseForm,
} from '../../core-ui';
import useGoogleMaps from '../../utils/useGoogleMaps';
import {
  Action,
  State as OnboardingState,
  NewLocationPlan,
  NewLocationPlanObj,
} from '../../reducers/tenantOnboardingReducer';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { validateNumber } from '../../utils/validation';
import { FONT_SIZE_SMALL } from '../../constants/theme';
import { RED_TEXT } from '../../constants/colors';
import { LocationInput } from '../../generated/globalTypes';
import { NEW_LOCATION_PLAN_OPTIONS } from '../../constants/locationPlan';

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function TenantGoals(props: Props) {
  let { isLoading } = useGoogleMaps();
  let history = useHistory();
  let { dispatch, state: onboardingState } = props;
  let [selectedNewLocationPlan, setNewLocationPlan] = useState<NewLocationPlanObj>(
    onboardingState.tenantGoals?.newLocationPlan || NEW_LOCATION_PLAN_OPTIONS[0]
  );
  let [selectedLocations, setSelectedLocations] = useState<Array<LocationInput>>(
    onboardingState.tenantGoals?.location || []
  );
  let hasFillLocations = selectedLocations.length > 0;
  let { watch, errors, register, triggerValidation } = useForm();
  let locationCount = watch('locationCount');
  let locationInputError = errors?.locationCount;
  let allValid =
    selectedNewLocationPlan.value === NewLocationPlan.YES
      ? locationCount && !locationInputError && selectedLocations.length > 0
      : true;

  useEffect(() => {
    triggerValidation('locationCount');
  }, [locationCount, triggerValidation]);

  let saveFormState = () => {
    dispatch({
      type: 'SAVE_CHANGES_TENANT_GOALS',
      values: {
        tenantGoals: {
          newLocationPlan: selectedNewLocationPlan,
          location: selectedLocations,
          locationCount,
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

  return (
    <Form onSubmit={onSubmit}>
      <Content flex>
        <RadioGroup
          name="new-location-plan"
          label="Are you planning to open new locations within the next year?"
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
                <MultiSelectLocation
                  label="Where will you open your locations? (Cities, regions, or counties)"
                  onSelected={(values: Array<LocationInput>) => {
                    setSelectedLocations(values);
                  }}
                  defaultSelected={onboardingState.tenantGoals?.location}
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
                defaultValue={onboardingState.tenantGoals?.locationCount}
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
  padding-top: 6px;
`;

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;

const FieldContainer = styled(View)`
  padding: 12px 0;
`;
