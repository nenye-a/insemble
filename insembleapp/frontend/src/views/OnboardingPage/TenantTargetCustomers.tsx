import React, { useState } from 'react';
import styled from 'styled-components';
import { View, Alert, Label, Button, Text } from '../../core-ui';
import { Filter } from '../../components';
import { MUTED_TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_XSMALL, FONT_SIZE_SMALL } from '../../constants/theme';

const INITIAL_INCOME_RANGE = [100, 200];
const INITIAL_AGE_RANGE = [25, 40];

export default function TenantTargetCustomers() {
  let [noPreferenceAge, setNoPreferenceAge] = useState(false);
  let [noPreferenceIncome, setNoPreferenceIncome] = useState(false);
  let [noPreferencePsychographics, setNoPreferencePsychographics] = useState(false);
  let [selectedPsychographics, setSelectedPsychographics] = useState<Array<string>>([]);
  let [selectedAgeRange, setSelectedAgeRange] = useState<Array<number>>(INITIAL_AGE_RANGE);
  let [selectedIncomeRange, setSelectedIncomeRange] = useState<Array<number>>(INITIAL_INCOME_RANGE);

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
            style={{ height: 0 }}
            textProps={{
              style: { fontStyle: 'italic', fontSize: FONT_SIZE_SMALL, color: MUTED_TEXT_COLOR },
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
        hasPreference={!noPreferenceAge}
        onNoPreferencePress={() => {
          setNoPreferenceAge(!noPreferenceAge);
        }}
        values={selectedAgeRange}
        minimum={0}
        maximum={100}
        onSliderChange={(values: Array<number>) => {
          setSelectedAgeRange(values);
        }}
      />
      <FilterContainer
        title="Income"
        visible
        rangeSlide
        income
        noPreferenceButton
        hasPreference={!noPreferenceIncome}
        onNoPreferencePress={() => {
          setNoPreferenceIncome(!noPreferenceIncome);
        }}
        values={selectedIncomeRange}
        minimum={0}
        maximum={500}
        onSliderChange={(values: Array<number>) => setSelectedIncomeRange(values)}
      />
      <FilterContainer
        visible
        search
        noPreferenceButton
        hasPreference={!noPreferencePsychographics}
        onNoPreferencePress={() => {
          setNoPreferencePsychographics(!noPreferencePsychographics);
        }}
        title="Psychographics"
        allOptions={['Sporty', 'Love Nature', 'Other']}
        selectedOptions={selectedPsychographics}
        onSelect={(option: string) => {
          setSelectedPsychographics([...selectedPsychographics, option]);
        }}
        onUnSelect={(option: string) => {
          let newSelectedOptions = selectedPsychographics.filter((item) => item !== option);
          setSelectedPsychographics(newSelectedOptions);
        }}
        onClear={() => setSelectedPsychographics([])}
      />
    </Container>
  );
}

const Container = styled(View)`
  padding: 24px 48px;
`;

const RowedView = styled(View)`
  flex-direction: row;
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
