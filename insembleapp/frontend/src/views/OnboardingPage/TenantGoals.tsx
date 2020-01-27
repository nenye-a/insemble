import React, { useState } from 'react';
import styled from 'styled-components';

import { RadioGroup, Label, View, TextInput } from '../../core-ui';

export default function TenantGoals() {
  let [selectedNewLocationPlan, setNewLocationPlan] = useState('');

  return (
    <Container>
      <Label
        text="Are you planning to open new locations within the next year?"
        id="new-location-plan"
      />
      <RadioGroup
        name="new-location-plan"
        options={[
          'Yes',
          'Not actively, but willing to open new locations',
          'Not planning to open any new locations within the year',
        ]}
        selectedOption={selectedNewLocationPlan}
        onSelect={(item) => {
          setNewLocationPlan(item);
        }}
        radioItemProps={{ style: { marginTop: 9 } }}
        style={{ marginBottom: 24 }}
      />
      {/* TODO: change to Autocomplete TextInput with Pill */}
      {selectedNewLocationPlan === 'Yes' && (
        <>
          <TextInput
            label="Where will you open your next locations?"
            style={{ marginBottom: 24 }}
          />
          {/* TODO: show location number input after the Autocomplete TextInput is filledx */}
          <LocationsNumberInput label="How many locations do you expect to open in the next 2 years?" />
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
