import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Card, Button, Text, TextInput, RadioGroup, MultiSelectLocation } from '../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../constants/theme';
import { THEME_COLOR } from '../constants/colors';
import { useGoogleMaps } from '../utils';
import SvgArrowBack from '../components/icons/arrow-back';

export default function BrandDetail() {
  let history = useHistory();
  let { isLoading } = useGoogleMaps();
  let [matchesEditable, setMatchesEditable] = useState(false);
  let [goalsEditable, setGoalsEditable] = useState(false);
  let [selectedIsLookingLocation, setSelectedIsLookingLocation] = useState('');
  let [, setSelectedLocations] = useState<Array<string>>([]);
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  return (
    <Container flex>
      <View style={{ alignItems: 'flex-start' }}>
        <Button
          mode="transparent"
          text="Back to Your Brand"
          icon={<SvgArrowBack style={{ color: THEME_COLOR }} />}
          textProps={{ style: { marginLeft: 8 } }}
          onPress={() => history.push('/user/tenant-matches')}
        />
      </View>
      <RowedView>
        <Title>Matches</Title>
        <Button
          mode="transparent"
          text="Edit Matches"
          onPress={() => {
            setMatchesEditable(true);
          }}
        />
      </RowedView>
      <TextInput
        label="Business Name"
        placeholder="Business Name"
        disabled={!matchesEditable}
        containerStyle={inputContainerStyle}
      />
      <TextInput
        label="Representative Location Address"
        placeholder="Representative Location Address"
        disabled={!matchesEditable}
        containerStyle={inputContainerStyle}
      />
      <RowedView>
        <Title>Goals</Title>
        <Button
          mode="transparent"
          text="Edit Goals"
          onPress={() => {
            setGoalsEditable(!goalsEditable);
          }}
        />
      </RowedView>
      <RadioGroupWrapper
        label="Are you actively looking for new locations?"
        options={[
          'Actively expanding',
          'Not actively looking, but willing to open new locations',
          'Not looking for any new locations at the moment',
        ]}
        selectedOption={selectedIsLookingLocation}
        onSelect={(value: string) => {
          setSelectedIsLookingLocation(value);
        }}
        disabled={!goalsEditable}
        radioItemProps={{ style: { marginTop: 8 } }}
      />

      {!isLoading && (
        <MultiSelectLocation
          label="Where will you open your locations?"
          onSelected={(locations) => {
            setSelectedLocations(locations);
          }}
          containerStyle={inputContainerStyle}
        />
      )}
      <LocationsNumberInput
        label="How many locations do you expect to open in the next 2 years?"
        placeholder="1"
        disabled={!goalsEditable}
        containerStyle={inputContainerStyle}
      />

      <RowedView>
        <Title>Locations & Performance</Title>
        <Button
          mode="transparent"
          text="Add, remove, or edit locations"
          onPress={() => {
            setGoalsEditable(true);
          }}
        />
      </RowedView>
      {/* TODO: add Table here */}
    </Container>
  );
}

const Container = styled(Card)`
  padding: 12px 24px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  color: ${THEME_COLOR};
`;

const LocationsNumberInput = styled(TextInput)`
  width: 42px;
`;

const RadioGroupWrapper = styled(RadioGroup)`
  padding: 12px 0;
`;
