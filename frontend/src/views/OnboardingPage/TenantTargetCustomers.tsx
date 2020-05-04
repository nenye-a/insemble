import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { View, Alert, Label, Button, Text, TextInput, Form as BaseForm } from '../../core-ui';
import { Filter } from '../../components';
import { MUTED_TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_MEDIUMSMALL } from '../../constants/theme';
import { convertToKilos } from '../../utils';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import {
  GET_PERSONA_LIST,
  GET_EDUCATION_LIST,
  GET_AUTOPOPULATE_FILTER,
} from '../../graphql/queries/server/filters';
import { Education_education as EducationEducation } from '../../generated/Education';
import {
  AutoPopulateFilter,
  AutoPopulateFilterVariables,
} from '../../generated/AutoPopulateFilter';
import { LocationState } from './types';
import OnboardingFooter from '../../components/layout/OnboardingFooter';

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
  let { targetCustomers, confirmBusinessDetail } = state;
  let history = useHistory<LocationState>();

  let { data: personaData, loading: personaLoading } = useQuery(GET_PERSONA_LIST);
  let { data: educationData, loading: educationLoading } = useQuery(GET_EDUCATION_LIST);
  let { data: autoPopulateData, loading: autoPopulateLoading } = useQuery<
    AutoPopulateFilter,
    AutoPopulateFilterVariables
  >(GET_AUTOPOPULATE_FILTER, {
    variables: {
      brandName: confirmBusinessDetail.name,
      address: confirmBusinessDetail.location?.address || '',
    },
    skip: !confirmBusinessDetail.name || !confirmBusinessDetail.location?.address,
  });
  let [noAgePreference, setNoAgePreference] = useState(targetCustomers.noAgePreference);
  let [noPersonasPreference, setNoPersonasPreference] = useState(
    targetCustomers.noPersonasPreference
  );
  let [noMinDaytimePopulationPreference, setNoMinDaytimePopulationPreference] = useState(
    targetCustomers.noMinDaytimePopulationPreference
  );
  let [noEducationsPreference, setNoEducationsPreference] = useState(
    targetCustomers.noEducationsPreference
  );
  let [selectedPersonas, setSelectedPersonas] = useState<Array<string>>(
    targetCustomers.personas || []
  );
  let [selectedEducations, setSelectedEducations] = useState<Array<string>>(
    targetCustomers.educations || []
  );
  let [minDaytimePopulation, setMinDaytimePopulation] = useState('0');
  let [[minAge, maxAge], setSelectedAgeRange] = useState<Array<number>>([
    targetCustomers.minAge === 0 ? 0 : targetCustomers.minAge || INTIIAL_MIN_AGE,
    targetCustomers.maxAge || INTIIAL_MAX_AGE,
  ]);
  let [[minIncome, maxIncome], setSelectedIncomeRange] = useState<Array<number>>([
    targetCustomers.minIncome === 0 ? 0 : targetCustomers.minIncome || INITIAL_MIN_INCOME,
    targetCustomers.maxIncome || INITIAL_MAX_INCOME,
  ]);

  useEffect(() => {
    if (autoPopulateData?.autoPopulateFilter && Object.keys(targetCustomers).length === 0) {
      let { personas, income, age } = autoPopulateData.autoPopulateFilter;
      let { min: autoMinIncome, max: autoMaxIncome } = income;
      let { min: autoMinAge, max: autoMaxAge } = age;
      if (personas.length > 0) {
        setSelectedPersonas(personas);
      }
      if (minIncome && maxIncome) {
        setSelectedIncomeRange([
          Number(convertToKilos(autoMinIncome)),
          Number(convertToKilos(autoMaxIncome)),
        ]);
      }
      if (minAge && maxAge) {
        setSelectedAgeRange([autoMinAge, autoMaxAge]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPopulateLoading, autoPopulateData]);

  let saveFormState = () => {
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
          noPersonasPreference,
          noEducationsPreference,
          minDaytimePopulation,
        },
      },
    });
  };
  let onSubmit = () => {
    saveFormState();
    history.push('/verify/step-4');
  };

  return (
    <Form onSubmit={onSubmit}>
      <Content>
        <Alert
          visible
          text="Your customer criteria has been pre-populated based on your store's location."
        />
        <DescriptionContainer>
          <Label text="Confirm your target customer criteria." />
          <ItalicText fontSize={FONT_SIZE_MEDIUMSMALL} color={MUTED_TEXT_COLOR}>
            If you have no preference, select “no preference” and we will handle the rest.
          </ItalicText>
        </DescriptionContainer>

        <FilterContainer
          title="Income"
          visible
          rangeSlide
          income
          values={[minIncome, maxIncome]}
          minimum={0}
          maximum={200}
          onSliderChange={(values: Array<number>) => setSelectedIncomeRange(values)}
          loading={autoPopulateLoading}
          noBottomWrapper={true}
        />
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
          sliderDisabled={noAgePreference}
          loading={autoPopulateLoading}
        />
        {!educationLoading && educationData && (
          <FilterContainer
            visible
            search
            noPreferenceButton
            hasPreference={!noEducationsPreference}
            onNoPreferencePress={() => {
              setSelectedEducations([]);
              setNoEducationsPreference(!noEducationsPreference);
            }}
            title="Education"
            allOptions={
              educationData.education
                ? educationData.education.map((item: EducationEducation) => item.displayValue)
                : []
            }
            selectedOptions={selectedEducations}
            onSelect={(option: string) => {
              if (noEducationsPreference) {
                setNoEducationsPreference(false);
              }
              setSelectedEducations([...selectedEducations, option]);
            }}
            onUnSelect={(option: string) => {
              let newSelectedOptions = selectedEducations.filter((item) => item !== option);
              setSelectedEducations(newSelectedOptions);
            }}
            onClear={() => setSelectedEducations([])}
          />
        )}
        {!personaLoading && personaData && (
          <FilterContainer
            visible
            search
            noPreferenceButton
            link="https://taxonomy.spatial.ai/"
            linkTitle="Psychographics"
            hasPreference={!noPersonasPreference}
            onNoPreferencePress={() => {
              setSelectedPersonas([]);
              setNoPersonasPreference(!noPersonasPreference);
            }}
            title="Consumer Personas"
            allOptions={personaData.personas}
            selectedOptions={selectedPersonas}
            onSelect={(option: string) => {
              if (noPersonasPreference) {
                setNoPersonasPreference(false);
              }
              setSelectedPersonas([...selectedPersonas, option]);
            }}
            onUnSelect={(option: string) => {
              let newSelectedOptions = selectedPersonas.filter((item) => item !== option);
              setSelectedPersonas(newSelectedOptions);
            }}
            onClear={() => setSelectedPersonas([])}
            loading={autoPopulateLoading}
          />
        )}
        <DaytimeContainer>
          <MinDaytimePopulationInput
            onChange={(e) => {
              setMinDaytimePopulation(e.target.value);
            }}
            label="Minimum Daytime Population"
            placeholder="0"
            errorMessage={!minDaytimePopulation ? 'Field should not be empty' : ''}
            value={minDaytimePopulation}
          />
          <Button
            mode={!noMinDaytimePopulationPreference ? 'transparent' : 'primary'}
            text="No Preference"
            onPress={() => setNoMinDaytimePopulationPreference(!noMinDaytimePopulationPreference)}
            style={!noMinDaytimePopulationPreference ? { fontStyle: 'italic' } : undefined}
          />
        </DaytimeContainer>
      </Content>
      <OnboardingFooter>
        <TransparentButton
          text="Back"
          mode="transparent"
          onPress={() => {
            saveFormState();
            history.goBack();
          }}
        />
        <Button text="Next" type="submit" />
      </OnboardingFooter>
    </Form>
  );
}

const Form = styled(BaseForm)`
  flex: 1;
`;

const Content = styled(View)`
  padding: 24px 48px;
`;

const MinDaytimePopulationInput = styled(TextInput)`
  width: 100px;
`;

const DaytimeContainer = styled(View)`
  flex-direction: row;
  align-items: flex-end;
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

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;
