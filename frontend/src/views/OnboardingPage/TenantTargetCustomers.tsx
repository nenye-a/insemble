import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Alert, Label, Button, Text } from '../../core-ui';
import { Filter } from '../../components';
import { MUTED_TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_XSMALL, FONT_SIZE_SMALL } from '../../constants/theme';
import {
  Action,
  State as OnboardingState,
  TargetCustomers,
} from '../../reducers/tenantOnboardingReducer';
import { GET_PERSONA_LIST } from '../../graphql/queries/server/filters';

const INITIAL_INCOME_RANGE = [100, 200];
const INITIAL_AGE_RANGE = [25, 40];

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function TenantTargetCustomers(props: Props) {
  let { dispatch, state } = props;
  let { targetCustomers } = state;
  let { data: personaData, loading: personaLoading } = useQuery(GET_PERSONA_LIST);
  let [editCriteriaDisabled, toggleEditCriteria] = useState(true);
  let [noAgePreference, setNoAgePreference] = useState(targetCustomers.noAgePreference);
  let [noIncomePreference, setNoIncomePreference] = useState(targetCustomers.noIncomePreference);
  let [noPersonasPreference, setNoPersonasPreference] = useState(
    targetCustomers.noPersonasPreference
  );
  let [selectedPersonas, setSelectedPersonas] = useState<Array<string>>(
    targetCustomers.personas || []
  );
  let [[minAge, maxAge], setSelectedAgeRange] = useState<Array<number>>([
    targetCustomers.minAge || INITIAL_AGE_RANGE[0],
    targetCustomers.maxAge || INITIAL_AGE_RANGE[1],
  ]);
  let [[minIncome, maxIncome], setSelectedIncomeRange] = useState<Array<number>>([
    targetCustomers.minIncome || INITIAL_INCOME_RANGE[0],
    targetCustomers.maxIncome || INITIAL_INCOME_RANGE[1],
  ]);

  useEffect(() => {
    dispatch({
      type: 'SAVE_CHANGES',
      values: ({
        targetCustomers: {
          minAge,
          maxAge,
          minIncome,
          maxIncome,
          personas: selectedPersonas,
          noAgePreference,
          noIncomePreference,
          noPersonasPreference,
        },
      } as unknown) as TargetCustomers,
    });
  }, [
    dispatch,
    noAgePreference,
    noIncomePreference,
    noPersonasPreference,
    minAge,
    maxAge,
    minIncome,
    maxIncome,
    selectedPersonas,
    selectedPersonas.length,
  ]);

  return (
    <Container>
      <Alert
        visible
        text="Insemble uses your location to automatically generate the best customer criteria for your business."
      />
      <DescriptionContainer>
        <RowedView>
          <Label text="Confirm your target customer criteria." />
          <Button
            mode="transparent"
            text="edit criteria"
            style={{ marginLeft: 12, height: 18 }}
            textProps={{
              style: { fontStyle: 'italic', fontSize: FONT_SIZE_SMALL, color: MUTED_TEXT_COLOR },
            }}
            onPress={() => {
              toggleEditCriteria(!editCriteriaDisabled);
            }}
          />
        </RowedView>
        <ItalicText fontSize={FONT_SIZE_XSMALL} color={MUTED_TEXT_COLOR}>
          If you have no preference, select “no preference” and we will handle the rest.
        </ItalicText>
      </DescriptionContainer>
      <FilterContainer
        title="Age"
        visible
        rangeSlide
        noPreferenceButton
        hasPreference={!noAgePreference}
        onNoPreferencePress={() => {
          setNoAgePreference(!noAgePreference);
        }}
        values={[minAge, maxAge]}
        minimum={0}
        maximum={100}
        onSliderChange={(values: Array<number>) => {
          setSelectedAgeRange(values);
        }}
        disabled={editCriteriaDisabled}
      />
      <FilterContainer
        title="Income"
        visible
        rangeSlide
        income
        noPreferenceButton
        hasPreference={!noIncomePreference}
        onNoPreferencePress={() => {
          setNoIncomePreference(!noIncomePreference);
        }}
        values={[minIncome, maxIncome]}
        minimum={0}
        maximum={500}
        onSliderChange={(values: Array<number>) => setSelectedIncomeRange(values)}
        disabled={editCriteriaDisabled}
      />
      {!personaLoading && personaData && (
        <FilterContainer
          visible
          search
          noPreferenceButton
          hasPreference={!noPersonasPreference}
          onNoPreferencePress={() => {
            setNoPersonasPreference(!noPersonasPreference);
          }}
          title="Consumer Personas"
          allOptions={personaData.personas}
          selectedOptions={selectedPersonas}
          onSelect={(option: string) => {
            setSelectedPersonas([...selectedPersonas, option]);
          }}
          onUnSelect={(option: string) => {
            let newSelectedOptions = selectedPersonas.filter((item) => item !== option);
            setSelectedPersonas(newSelectedOptions);
          }}
          onClear={() => setSelectedPersonas([])}
          disabled={editCriteriaDisabled}
        />
      )}
    </Container>
  );
}

const Container = styled(View)`
  padding: 24px 48px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const DescriptionContainer = styled(View)`
  margin: 24px 0;
`;

const ItalicText = styled(Text)`
  font-style: italic;
`;

const FilterContainer = styled(Filter)`
  margin-bottom: 24px;
`;
