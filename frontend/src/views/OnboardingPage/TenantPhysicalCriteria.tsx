import React, { useState, useEffect, useMemo, Dispatch } from 'react';
import styled from 'styled-components';

import { View, Alert, Label, Checkbox, MultiSelectInput, Text } from '../../core-ui';
import { RangeInput } from '../../components';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import { RED_TEXT } from '../../constants/colors';
import { FONT_SIZE_SMALL } from '../../constants/theme';
import { validateNumber } from '../../utils/validation';

const SPACE_OPTIONS = ['Stand alone', 'Shopping center', 'Strip mall'];

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function TenantPhysicalCriteria(props: Props) {
  let { dispatch } = props;
  let [minSqft, setMinSqft] = useState('');
  let [maxSqft, setMaxSqft] = useState('');
  let [minFrontageWidth, setMinFrontageWidth] = useState('');
  let [maxFrontageWidth, setMaxFrontageWidth] = useState('');
  let [selectedSpaceOptions, setSelectedSpaceOptions] = useState<Array<string>>([]);
  let [options] = useState<Array<string>>([]);
  let [, setSelectedEquipmentOptions] = useState<Array<string>>([]);

  let sqftError = useMemo(() => getRangeInputError(minSqft, maxSqft), [minSqft, maxSqft]);

  let frontageWidthError = useMemo(() => getRangeInputError(minFrontageWidth, maxFrontageWidth), [
    minFrontageWidth,
    maxFrontageWidth,
  ]);

  let allFilled = minSqft && maxSqft && minFrontageWidth && maxFrontageWidth;
  let allValid = allFilled && !sqftError && !frontageWidthError;
  useEffect(() => {
    if (allValid) {
      dispatch({ type: 'ENABLE_NEXT_BUTTON' });
      dispatch({
        type: 'SAVE_CHANGES_PHYSICAL_SITE_CRITERIA',
        values: {
          physicalSiteCriteria: {
            minSize: minSqft,
            maxSize: maxSqft,
            minFrontageWidth: minFrontageWidth,
            maxFrontageWidth: maxFrontageWidth,
            equipments: [],
            spaceType: selectedSpaceOptions,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValid, dispatch]);

  return (
    <Container>
      <Description
        visible
        text="Insemble uses your location to automatically generate the best customer criteria for your business."
      />
      <LabelText text="Sqft" />
      <RangeInputContainer
        lowValue={minSqft}
        highValue={maxSqft}
        onLowRangeInputChange={setMinSqft}
        onHighRangeInputChange={setMaxSqft}
      />
      <ErrorMessage>{sqftError}</ErrorMessage>
      <LabelText text="Frontage Width" />
      <RangeInputContainer
        lowValue={minFrontageWidth}
        highValue={maxFrontageWidth}
        onLowRangeInputChange={setMinFrontageWidth}
        onHighRangeInputChange={setMaxFrontageWidth}
      />
      <ErrorMessage>{frontageWidthError}</ErrorMessage>
      <Label text="Equipment Preference" />
      <MultiSelectInput
        placeholder={'Set Equipment Preference'}
        options={options}
        onChange={(values: Array<string>) => {
          setSelectedEquipmentOptions(values);
        }}
        containerStyle={{ marginBottom: 24 }}
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

function getRangeInputError(minValue: string, maxValue: string) {
  if (minValue && maxValue) {
    if (!validateNumber(minValue) || !validateNumber(maxValue)) {
      return 'Input can only be number';
    } else if (Number(minValue) >= Number(maxValue)) {
      return 'Minimum value should be lower than maximum value';
    }
    return '';
  }
  return '';
}

const Container = styled(View)`
  padding: 24px 48px;
`;

const RangeInputContainer = styled(RangeInput)`
  width: 216px;
  margin: 0 0 6px 0;
`;

const LabelText = styled(Label)`
  margin-bottom: 8px;
`;

const Description = styled(Alert)`
  margin-bottom: 21px;
`;

const ErrorMessage = styled(Text)`
  color: ${RED_TEXT};
  font-size: ${FONT_SIZE_SMALL};
  padding-bottom: 24px;
`;
