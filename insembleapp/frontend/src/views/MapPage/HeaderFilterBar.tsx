import React, { useState, ComponentProps } from 'react';
import styled from 'styled-components';

import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import { View, Dropdown, Button, Text } from '../../core-ui';
import TextInput from '../LandingPage/TextInput';
import Legend from './Legend';
import { WHITE, HEADER_BORDER_COLOR } from '../../constants/colors';

export default function HeaderFilterBar() {
  let [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('Recommended');

  return (
    <Container>
      <RowedView>
        <Text>Category Selection</Text>
        <Dropdown
          selectedValue={selectedDropdownValue}
          values={PROPERTY_TYPES}
          onItemSelected={(newValue: string) => setSelectedDropdownValue(newValue)}
        />
        <SaveButton text="Save Search" />
      </RowedView>
      <Text>Textinput search</Text>
      <Legend />
    </Container>
  );
}

const PROPERTY_TYPES = ['Available', 'Recommended'];

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Container = styled(RowedView)`
  padding: 12px 32px;
  z-index: 1;
  background-color: ${WHITE};
  box-shadow: 0px 1px 1px 0px ${HEADER_BORDER_COLOR};
  justify-content: space-between;
  position: sticky;
  top: 0px;
`;

const SaveButton = styled(Button)`
  margin-left: 8px;
`;
