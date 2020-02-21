import React, { useState } from 'react';
import styled from 'styled-components';

import { TextInput, View, RadioGroup, Label, Checkbox } from '../../core-ui';
import { FONT_SIZE_NORMAL } from '../../constants/theme';

export default function LocationConfirm() {
  let [selectedRelation, setSelectedRelation] = useState('');
  let [address, setAddress] = useState('');
  let [selectedType, setSelectedType] = useState<Array<string>>([]);
  let TYPE_OPTIONS = ['Free standing', 'Shopping center', 'Inline', 'Endcap', 'Pedestrian'];
  return (
    <>
      <FormContainer>
        <TextInput
          label="Physical Address"
          value={address}
          onChange={(event) => {
            setAddress(event.target.value);
          }}
        />
        <LabelText text="What is your relation to this property?" />
        <RadioGroup
          name="Marketing Preference"
          options={['Owner', 'Representative Agent']}
          selectedOption={selectedRelation}
          onSelect={(item) => {
            setSelectedRelation(item);
          }}
          radioItemProps={{ style: { marginBottom: 9 } }}
        />
        <LabelText text="What type of property is this?" />
        {TYPE_OPTIONS.map((option, index) => {
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
      </FormContainer>
    </>
  );
}

const FormContainer = styled(View)`
  padding: 24px 48px;
`;

const LabelText = styled(Label)`
  margin-top: 24px;
`;
