import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Alert, Label, Button, Text } from '../../core-ui';
import { Filter } from '../../components';
import { MUTED_TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_XSMALL, FONT_SIZE_SMALL } from '../../constants/theme';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import { GET_PERSONA_LIST, GET_EDUCATION_LIST } from '../../graphql/queries/server/filters';
import { Education_education } from '../../generated/Education';

// remove this when it's connected to endpoint that returns prefilled values
const INITIAL_MIN_INCOME = 100;
const INITIAL_MAX_INCOME = 200;
const INTIIAL_MIN_AGE = 25;
const INTIIAL_MAX_AGE = 40;

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function TenantTargetCustomers(props: Props) {
  let { dispatch, state } = props;
  let { targetCustomers } = state;
  let { data: personaData, loading: personaLoading } = useQuery(GET_PERSONA_LIST);
  let { data: educationData, loading: educationLoading } = useQuery(GET_EDUCATION_LIST);
  let [editCriteriaDisabled, toggleEditCriteria] = useState(true);
  let [noAgePreference, setNoAgePreference] = useState(targetCustomers.noAgePreference);
  let [noIncomePreference, setNoIncomePreference] = useState(targetCustomers.noIncomePreference);
  let [noPersonasPreference, setNoPersonasPreference] = useState(
    targetCustomers.noPersonasPreference
  );
  let [noEducationsPreference, setNoEducationsPrefence] = useState(
    targetCustomers.noEducationsPreference
  );
  let [selectedPersonas, setSelectedPersonas] = useState<Array<string>>(
    targetCustomers.personas || []
  );
  let [selectedEducations, setSelectedEducations] = useState<Array<string>>(
    targetCustomers.educations || []
  );
  let [[minAge, maxAge], setSelectedAgeRange] = useState<Array<number>>([
    targetCustomers.minAge || INTIIAL_MIN_AGE,
    targetCustomers.maxAge || INTIIAL_MAX_AGE,
  ]);
  let [[minIncome, maxIncome], setSelectedIncomeRange] = useState<Array<number>>([
    targetCustomers.minIncome || INITIAL_MIN_INCOME,
    targetCustomers.maxIncome || INITIAL_MAX_INCOME,
  ]);

  useEffect(() => {
    dispatch({
      type: 'SAVE_CHANGES_TARGET_CUSTOMERS',
      values: {
        targetCustomers: {
          minAge,
          maxAge,
          minIncome,
          maxIncome,
          personas: selectedPersonas,
          educations: selectedEducations,
          noAgePreference,
          noIncomePreference,
          noPersonasPreference,
          noEducationsPreference,
        },
      },
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
    selectedEducations,
    noEducationsPreference,
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
            text="Click here to edit criteria"
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
        maximum={65}
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
        maximum={200}
        onSliderChange={(values: Array<number>) => setSelectedIncomeRange(values)}
        disabled={editCriteriaDisabled}
      />
      {!educationLoading && educationData && (
        <FilterContainer
          visible
          search
          noPreferenceButton
          hasPreference={!noEducationsPreference}
          onNoPreferencePress={() => {
            styled;
            setNoEducationsPrefence(!noEducationsPreference);
          }}
          title="Education"
          allOptions={
            educationData.education
              ? educationData.education.map((item: Education_education) => item.displayValue)
              : []
          }
          selectedOptions={selectedEducations}
          onSelect={(option: string) => {
            setSelectedEducations([...selectedEducations, option]);
          }}
          onUnSelect={(option: string) => {
            let newSelectedOptions = selectedEducations.filter((item) => item !== option);
            setSelectedEducations(newSelectedOptions);
          }}
          onClear={() => setSelectedEducations([])}
          disabled={editCriteriaDisabled}
        />
      )}
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
  justify-content: space-between;
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
