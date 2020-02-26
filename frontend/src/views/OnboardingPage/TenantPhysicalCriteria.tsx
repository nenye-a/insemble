import React, { useState, useEffect, Dispatch } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Alert, Label, Checkbox, MultiSelectInput } from '../../core-ui';
import { RangeInput } from '../../components';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';

const SPACE_OPTIONS = ['Free standing', 'Shopping center', 'Inline', 'Endcap', 'Pedestrian'];

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function TenantPhysicalCriteria(props: Props) {
  let { dispatch } = props;
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [minSqft, setMinSqft] = useState('');
  let [minFrontageWidth, setMinFrontageWidth] = useState('');
  let [selectedSpaceOptions, setSelectedSpaceOptions] = useState<Array<string>>([]);
  let [selectedEquipmentOptions, setSelectedEquipmentOptions] = useState<Array<string>>([]);
  useEffect(() => {
    dispatch({ type: 'ENABLE_NEXT_BUTTON' });
    dispatch({
      type: 'SAVE_CHANGES_PHYSICAL_SITE_CRITERIA',
      values: {
        physicalSiteCriteria: {
          minSize: minSqft,
          minFrontageWidth: minFrontageWidth,
          equipments: selectedEquipmentOptions,
          spaceType: selectedSpaceOptions,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedEquipmentOptions, selectedSpaceOptions]);

  return (
    <Container>
      <Description
        visible
        text="Customer criteria has been pre-populated based on your store's location."
      />
      <LabelText text="Minimum Sqft" />
      <RangeInputContainer lowValue={minSqft} onLowRangeInputChange={setMinSqft} />
      <LabelText text="Minimum Frontage Width (ft)" />
      <RangeInputContainer
        lowValue={minFrontageWidth}
        onLowRangeInputChange={setMinFrontageWidth}
      />
      <LabelText text="Buildout Preference" />
      {!equipmentLoading && equipmentData && (
        <MultiSelectInput
          placeholder="Buildout preference"
          options={equipmentData.equipments}
          onChange={setSelectedEquipmentOptions}
          containerStyle={{ marginBottom: 24 }}
          inputContainerStyle={{ flex: 1 }}
        />
      )}
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
  width: 108px;
  margin: 0 0 6px 0;
`;

const LabelText = styled(Label)`
  margin-bottom: 8px;
`;

const Description = styled(Alert)`
  margin-bottom: 21px;
`;
