import React, { useState } from 'react';
import styled from 'styled-components';

import { TextInput, View, RadioGroup, Label, Checkbox } from '../../core-ui';
import { FONT_SIZE_NORMAL } from '../../constants/theme';

export default function LocationConfirm() {
  let [selectedRelation, setSelectedRelation] = useState('');
  let [address, setAddress] = useState('');
  let [selectedType, setSelectedType] = useState<Array<string>>([]);
  let [selectedService, setSelectedService] = useState<Array<string>>([]);
  let [otherService, setOtherService] = useState('');
  let TYPE_OPTIONS = ['Free standing', 'Shopping center', 'Inline', 'Endcap'];
  let SERVICE_OPTIONS = ['Retail', 'Restaurant', 'Fitness', 'Entertainment', 'Others'];
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
          options={['I am the owner of this property', 'I am an agent representing this property']}
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
        <LabelText text="What type of business can your property serve?" />
        {SERVICE_OPTIONS.map((option, index) => {
          let isChecked = selectedService.includes(option);
          return (
            <Checkbox
              key={index}
              size="18px"
              title={option}
              titleProps={{ style: { fontSize: FONT_SIZE_NORMAL } }}
              isChecked={isChecked}
              onPress={() => {
                if (isChecked) {
                  let newSelectedService = selectedService.filter(
                    (item: string) => item !== option
                  );
                  setSelectedService(newSelectedService);
                } else {
                  setSelectedService([...selectedService, option]);
                }
              }}
              style={{ lineHeight: 2 }}
            />
          );
        })}
        <OtherTextInput
          placeholder="Landlord"
          disabled={!selectedService.includes(SERVICE_OPTIONS[SERVICE_OPTIONS.length - 1])}
          value={otherService}
          onChange={(event) => {
            setOtherService(event.target.value);
          }}
        />
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
const OtherTextInput = styled(TextInput)`
  margin: 9px 0 9px 30px;
  width: 130px;
`;
