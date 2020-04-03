import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import {
  View,
  Alert,
  Label,
  Button,
  Text,
  TextInput,
  Form as BaseForm,
  LoadingIndicator,
} from '../../core-ui';
import { Filter } from '../../components';
import { MUTED_TEXT_COLOR, TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_SIZE_MEDIUMSMALL } from '../../constants/theme';
import { convertToKilos } from '../../utils';
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
import { TenantOnboardingState } from '../../graphql/localState';
import {
  GET_TENANT_ONBOARDING_STATE,
  UPDATE_TENANT_ONBOARDING,
} from '../../graphql/queries/client/tenantOnboarding';
import {
  INITIAL_MIN_AGE,
  INITIAL_MAX_AGE,
  INITIAL_MIN_INCOME,
  INITIAL_MAX_INCOME,
} from '../../constants/initialValues';

export default function TenantTargetCustomers() {
  let history = useHistory<LocationState>();

  let { data: personaData, loading: personaLoading } = useQuery(GET_PERSONA_LIST);
  let { data: educationData, loading: educationLoading } = useQuery(GET_EDUCATION_LIST);
  let [
    getAutoPopulateData,
    { data: autoPopulateData, loading: autoPopulateLoading },
  ] = useLazyQuery<AutoPopulateFilter, AutoPopulateFilterVariables>(GET_AUTOPOPULATE_FILTER, {});
  let { data: onboardingStateData, loading: onboardingStateLoading } = useQuery<
    TenantOnboardingState
  >(GET_TENANT_ONBOARDING_STATE);
  let [updateTenantOnboarding] = useMutation(UPDATE_TENANT_ONBOARDING);

  let [editCriteriaDisabled, toggleEditCriteria] = useState(true);
  let [noAgePreference, setNoAgePreference] = useState(false);
  let [noPersonasPreference, setNoPersonasPreference] = useState(false);
  let [noMinDaytimePopulationPreference, setNoMinDaytimePopulationPreference] = useState(false);
  let [noEducationsPreference, setNoEducationsPreference] = useState(false);
  let [selectedPersonas, setSelectedPersonas] = useState<Array<string>>([]);
  let [selectedEducations, setSelectedEducations] = useState<Array<string>>([]);
  let [minDaytimePopulation, setMinDaytimePopulation] = useState('0');
  let [[minAge, maxAge], setSelectedAgeRange] = useState<Array<number>>([
    INITIAL_MIN_AGE,
    INITIAL_MAX_AGE,
  ]);
  let [[minIncome, maxIncome], setSelectedIncomeRange] = useState<Array<number>>([
    INITIAL_MIN_INCOME,
    INITIAL_MAX_INCOME,
  ]);

  useEffect(() => {
    if (autoPopulateData?.autoPopulateFilter) {
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

  useEffect(() => {
    if (onboardingStateData) {
      let { confirmBusinessDetail, targetCustomers } = onboardingStateData.tenantOnboardingState;
      let { name, location } = confirmBusinessDetail;

      let {
        minAge,
        maxAge,
        minIncome,
        maxIncome,
        personas,
        educations,
        noAgePreference,
        noPersonasPreference,
        noEducationsPreference,
        noMinDaytimePopulationPreference,
        minDaytimePopulation,
      } = targetCustomers;
      console.log(name, location, 'HAHA');
      if (name && location) {
        getAutoPopulateData({
          variables: {
            brandName: name,
            address: location?.address || '',
          },
        });
      }
      setNoAgePreference(noAgePreference);
      setNoPersonasPreference(noPersonasPreference);
      setNoEducationsPreference(noEducationsPreference);
      setNoMinDaytimePopulationPreference(noMinDaytimePopulationPreference);
      setSelectedAgeRange([minAge, maxAge]);
      setSelectedIncomeRange([minIncome, maxIncome]);
      setSelectedPersonas(personas);
      setSelectedEducations(educations);
      setMinDaytimePopulation(minDaytimePopulation);
    }
  }, [onboardingStateData, getAutoPopulateData]);

  let onSubmit = async () => {
    await updateTenantOnboarding({
      variables: {
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
          noMinDaytimePopulationPreference,
          minDaytimePopulation,
        },
      },
    });

    history.push('/verify/step-4');
  };
  if (onboardingStateData) {
    return (
      <Form onSubmit={onSubmit}>
        <Content>
          <Alert
            visible
            text="Your customer criteria has been pre-populated based on your store's location."
          />
          <DescriptionContainer>
            <RowedView>
              <Label text="Confirm your target customer criteria." />
              <Button
                mode="transparent"
                text="Click here to edit criteria"
                style={{ marginLeft: 12, height: 18 }}
                textProps={{
                  style: {
                    fontStyle: 'italic',
                    fontSize: FONT_SIZE_SMALL,
                    color: TEXT_COLOR,
                  },
                }}
                onPress={() => {
                  toggleEditCriteria(!editCriteriaDisabled);
                }}
              />
            </RowedView>
            <ItalicText fontSize={FONT_SIZE_MEDIUMSMALL} color={MUTED_TEXT_COLOR}>
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
            sliderDisabled={noAgePreference}
            loading={autoPopulateLoading}
          />
          <FilterContainer
            title="Income"
            visible
            rangeSlide
            income
            values={[minIncome, maxIncome]}
            minimum={0}
            maximum={200}
            onSliderChange={(values: Array<number>) => setSelectedIncomeRange(values)}
            disabled={editCriteriaDisabled}
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
              disabled={editCriteriaDisabled}
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
              disabled={editCriteriaDisabled}
              loading={autoPopulateLoading}
            />
          )}
          <DaytimeContainer>
            <MinDaytimePopulationInput
              disabled={editCriteriaDisabled}
              onChange={(e) => {
                setMinDaytimePopulation(e.target.value);
              }}
              label="Minimum Daytime Population"
              placeholder="0"
              errorMessage={!minDaytimePopulation ? 'Field should not be empty' : ''}
            />
            <Button
              mode={!noMinDaytimePopulationPreference ? 'transparent' : 'primary'}
              text="No Preference"
              onPress={() => setNoMinDaytimePopulationPreference(!noMinDaytimePopulationPreference)}
              style={!noMinDaytimePopulationPreference ? { fontStyle: 'italic' } : undefined}
              disabled={editCriteriaDisabled}
            />
          </DaytimeContainer>
        </Content>
        <OnboardingFooter>
          <TransparentButton
            text="Back"
            mode="transparent"
            type="submit"
            onPress={() => history.goBack()}
          />
          <Button text="Next" type="submit" />
        </OnboardingFooter>
      </Form>
    );
  } else if (onboardingStateLoading) {
    return <LoadingIndicator />;
  }
  return null;
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

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;
