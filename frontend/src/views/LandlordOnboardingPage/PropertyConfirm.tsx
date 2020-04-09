import React, { useState, Dispatch } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Label, Checkbox, Form, Button } from '../../core-ui';
import { LocationInput } from '../../components';
import { SelectedLocation } from '../../components/LocationInput';
import { FONT_SIZE_NORMAL } from '../../constants/theme';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { withinLA } from '../../utils';
import { Role } from '../../types/types';

type Props = {
  dispatch: Dispatch<Action>;
  state: LandlordOnboardingState;
};

const USER_RELATIONS = ['Owner', 'Representative Agent'];

export default function PropertyConfirm(props: Props) {
  let history = useHistory();
  let { state: landlordOnboardingState, dispatch } = props;
  let { confirmLocation } = landlordOnboardingState;
  let [selectedRelation, setSelectedRelation] = useState(confirmLocation?.userRelations || []);
  let [location, setLocation] = useState<SelectedLocation>(
    confirmLocation?.physicalAddress || { lat: '', lng: '', address: '', id: '', name: '' }
  );
  let containerStyle = { paddingTop: 12, paddingBottom: 12 };

  let allValid = location.id && selectedRelation;
  let isWithinLA = withinLA(Number(location.lat), Number(location.lng));

  let handleSubmit = () => {
    if (isWithinLA) {
      if (allValid) {
        saveFormState();
        history.push('/landlord/new-property/step-2');
      }
    } else {
      history.push('/out-of-bound', {
        latitude: location.lat,
        longitude: location.lng,
        role: Role.LANDLORD,
      });
    }
  };

  let saveFormState = () => {
    dispatch({
      type: 'SAVE_CHANGES_CONFIRM_LOCATION',
      values: {
        confirmLocation: {
          ...landlordOnboardingState.confirmLocation,
          physicalAddress: location,
          userRelations: selectedRelation,
        },
      },
    });
  };

  return (
    <Container onSubmit={handleSubmit}>
      <ContentContainer flex>
        <LocationInput
          defaultValue={location.address}
          label="Address"
          placeholder="Property Address"
          onPlaceSelected={(location) => {
            setLocation(location);
          }}
          containerStyle={containerStyle}
        />
        <FieldInput>
          <LabelText text="What is your relation to this property?" />
          {USER_RELATIONS.map((option, index) => {
            let isChecked = selectedRelation.includes(option);
            return (
              <Checkbox
                key={index}
                title={option}
                titleProps={{ style: { fontSize: FONT_SIZE_NORMAL } }}
                isChecked={isChecked}
                onPress={() => {
                  if (isChecked) {
                    let newSelectedRelation = selectedRelation.filter(
                      (item: string) => item !== option
                    );
                    setSelectedRelation(newSelectedRelation);
                  } else {
                    setSelectedRelation([...selectedRelation, option]);
                  }
                }}
                style={{ lineHeight: 2 }}
              />
            );
          })}
        </FieldInput>
      </ContentContainer>
      <OnboardingFooter>
        <Button text="Next" type="submit" disabled={!allValid} />
      </OnboardingFooter>
    </Container>
  );
}

const Container = styled(Form)`
  flex: 1;
`;

const ContentContainer = styled(View)`
  padding: 12px 48px;
  z-index: 3;
`;

const LabelText = styled(Label)`
  margin-bottom: 8px;
`;

const FieldInput = styled(View)`
  padding: 12px 0;
`;
