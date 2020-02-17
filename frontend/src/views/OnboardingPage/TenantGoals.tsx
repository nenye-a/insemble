import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, FieldError } from 'react-hook-form';

import { RadioGroup, Label, View, TextInput, MultiSelectLocation, Text } from '../../core-ui';
import useGoogleMaps from '../../utils/useGoogleMaps';
import {
  Action,
  State as OnboardingState,
  NewLocationPlan,
  NewLocationPlanObj,
} from '../../reducers/tenantOnboardingReducer';
import { validateNumber } from '../../utils/validation';
import { FONT_SIZE_SMALL } from '../../constants/theme';
import { RED_TEXT } from '../../constants/colors';
import { LocationInput } from '../../generated/globalTypes';

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

const NEW_LOCATION_PLAN_OPTIONS = [
  {
    label: 'Yes',
    value: NewLocationPlan.YES,
  },
  {
    label: 'Not actively, but willing to open new locations',
    value: NewLocationPlan.NOT_ACTIVE,
  },
  {
    label: 'Not planning to open any new locations within the year',

    value: NewLocationPlan.NOT_PLANNING,
  },
];

export default function TenantGoals(props: Props) {
  let { isLoading } = useGoogleMaps();
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

  useEffect(() => {
    triggerValidation('locationCount');
  }, [locationCount, triggerValidation]);

  useEffect(() => {
    let allValid =
      selectedNewLocationPlan.value === NewLocationPlan.YES
        ? locationCount && !locationInputError && selectedLocations.length > 0
        : true;
    if (allValid) {
      dispatch({ type: 'ENABLE_NEXT_BUTTON' });

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
    } else {
      dispatch({ type: 'DISABLE_NEXT_BUTTON' });
    }
  }, [locationCount, selectedNewLocationPlan, selectedLocations, locationInputError, dispatch]);

  return (
    <Container>
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
        style={{ marginBottom: 24 }}
        titleExtractor={(item: NewLocationPlanObj) => item.label}
      />

      {selectedNewLocationPlan.value === NewLocationPlan.YES && (
        <>
          {!isLoading && (
            <>
              <Label text="Where will you open your locations?" />
              <MultiSelectLocation
                onSelected={(values: Array<LocationInput>) => {
                  setSelectedLocations(values);
                }}
                defaultSelected={onboardingState.tenantGoals?.location}
              />
              {selectedLocations.length === 0 && (
                <ErrorMessage>Locations cannot be empty</ErrorMessage>
              )}
            </>
          )}
          {hasFillLocations && (
            <LocationsNumberInput
              label="How many locations do you expect to open in the next 2 years?"
              name="locationCount"
              defaultValue={onboardingState.tenantGoals?.locationCount}
              ref={register({
                required: 'Number of locations should not be empty',
                validate: (val) => validateNumber(val) || 'Incorrect number of location',
              })}
              errorMessage={(errors?.locationCount as FieldError)?.message || ''}
            />
          )}
        </>
      )}
    </Container>
  );
}

const Container = styled(View)`
  padding: 24px 48px;
`;

const LocationsNumberInput = styled(TextInput)`
  width: 42px;
`;

const ErrorMessage = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  color: ${RED_TEXT};
`;
