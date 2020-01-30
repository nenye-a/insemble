import React, { useState } from 'react';
import styled from 'styled-components';

import { View, Alert, Label, Checkbox, MultiSelectInput } from '../../core-ui';
import { RangeInput } from '../../components';

const SPACE_OPTIONS = ['Stand alone', 'Shopping center', 'Strip mall'];

export default function TenantPhysicalCriteria() {
  let [selectedSpaceOptions, setSelectedSpaceOptions] = useState<Array<string>>([]);
  let [options] = useState<Array<string>>([]);
  let [, setSelectedEquipmentOptions] = useState<Array<string>>([]);
  return (
    <Container>
      <Description
        visible
        text="Insemble uses your location to automatically generate the best customer criteria for your business. "
      />
      <LabelText text="Sqft" />
      <RangeInputContainer />
      <LabelText text="Ceiling height" />
      <RangeInputContainer />
      <Label text="Equipment Preference" />
      <MultiSelectInput
        placeholder={'Set Equipment Preference'}
        options={options}
        onSelected={(values: Array<string>) => {
          setSelectedEquipmentOptions(values);
        }}
      />
      <LabelText text="Space type" />
      {SPACE_OPTIONS.map((option, index) => {
        let isChecked = selectedSpaceOptions.includes(option);
        return (
          <Checkbox
            key={index}
            size="18px"
            title={option}
            isChecked={isChecked}
            onPress={() => {
              if (isChecked) {
                let newSelectedSpaceOptions = selectedSpaceOptions.filter(
                  (item: string) => item !== option
                );
                setSelectedSpaceOptions(newSelectedSpaceOptions);
              } else {
                setSelectedSpaceOptions([...selectedSpaceOptions, option]);
              }
            }}
            style={{ lineHeight: 2 }}
          />
        );
      })}
    </Container>
  );
}

const Container = styled(View)`
  padding: 24px 48px;
`;

const RangeInputContainer = styled(RangeInput)`
  width: 216px;
  margin: 0 0 24px 0;
`;

const LabelText = styled(Label)`
  margin-bottom: 8px;
`;

const Description = styled(Alert)`
  margin-bottom: 21px;
`;
