import React, { useState, Dispatch } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, RadioGroup, Label, Checkbox, Form, Button } from '../../core-ui';
import { LocationInput } from '../../components';
import { SelectedLocation } from '../../components/LocationInput';
import { FONT_SIZE_NORMAL } from '../../constants/theme';
import { SPACES_TYPE } from '../../constants/spaces';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';
import OnboardingFooter from '../../components/layout/OnboardingFooter';

type Props = {
  dispatch: Dispatch<Action>;
  state: LandlordOnboardingState;
};

export default function PropertyConfirm(props: Props) {
  let history = useHistory();
  let { state: landlordOnboardingState, dispatch } = props;
  let { confirmLocation } = landlordOnboardingState;
  let [selectedRelation, setSelectedRelation] = useState(confirmLocation?.userRelation || '');
  let [location, setLocation] = useState<SelectedLocation>(
    confirmLocation?.physicalAddress || { lat: '', lng: '', address: '', id: '', name: '' }
  );
  let [selectedType, setSelectedType] = useState<Array<string>>(
    confirmLocation?.propertyType || []
  );
  let containerStyle = { marginBottom: 24 };

  let allValid = location && selectedRelation;

  let handleSubmit = () => {
    if (allValid) {
      dispatch({
        type: 'SAVE_CHANGES_CONFIRM_LOCATION',
        values: {
          confirmLocation: {
            ...landlordOnboardingState.confirmLocation,
            physicalAddress: location,
            userRelation: selectedRelation,
            propertyType: selectedType,
          },
        },
      });
      history.push('/landlord/new-property/step-2');
    }
  };

  return (
    <Container
      onSubmit={() => {
        handleSubmit();
      }}
    >
      <ContentContainer flex>
        <LocationInput
          defaultValue={location.address}
          label="Physical Address"
          placeholder="Property Address"
          onPlaceSelected={(location) => {
            setLocation(location);
          }}
          containerStyle={containerStyle}
        />
        <RadioGroup
          label="What is your relation to this property?"
          name="Marketing Preference"
          options={['Owner', 'Representative Agent']}
          selectedOption={selectedRelation}
          onSelect={(item) => {
            setSelectedRelation(item);
          }}
          radioItemProps={{ style: { marginBottom: 9 } }}
        />
        <LabelText text="What type of property is this?" />
        {SPACES_TYPE.map((option, index) => {
          let isChecked = selectedType.includes(option);
          return (
            <Checkbox
              key={index}
              size="18px"
              title={option}
              titleProps={{ style: { fontSize: FONT_SIZE_NORMAL } }}
              isChecked={isChecked}
              onPress={() => {
                if (isChecked) {
                  let newSelectedType = selectedType.filter((item: string) => item !== option);
                  setSelectedType(newSelectedType);
                } else {
                  setSelectedType([...selectedType, option]);
                }
              }}
              style={{ lineHeight: 2 }}
            />
          );
        })}
      </ContentContainer>
      <OnboardingFooter>
        <Button text="Next" type="submit" disabled={!allValid} onPress={handleSubmit} />
      </OnboardingFooter>
    </Container>
  );
}

const Container = styled(Form)`
  flex: 1;
`;

const ContentContainer = styled(View)`
  padding: 24px 48px;
`;

const LabelText = styled(Label)`
  margin-top: 12px;
  margin-bottom: 8px;
`;
