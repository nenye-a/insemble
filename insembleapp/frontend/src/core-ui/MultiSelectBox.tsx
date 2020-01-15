import React, { useState } from 'react';
import styled from 'styled-components';
import View from './View';
import Text from './Text';
import Card from './Card';
import TouchableOpacity from './TouchableOpacity';
import ClickAway from './ClickAway';

import { THEME_COLOR, WHITE } from '../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';

type Props = {
  selectedValues: Array<string>;
};

export default function MultiSelectBox(props: Props) {
  let { selectedValues } = props;
  let [pickerOpen, togglePicker] = useState(true);

  let selectedValuesString = selectedValues.join(', ');
  return (
    <View>
      <Container onPress={() => togglePicker(!pickerOpen)}>
        <Text>{selectedValuesString}</Text>
      </Container>
      {pickerOpen && (
        <ClickAway onClickAway={() => togglePicker(false)}>
          <PickerContainer>{/* combine with filter component */}</PickerContainer>
        </ClickAway>
      )}
    </View>
  );
}

const Container = styled(TouchableOpacity)`
  border: 0.5px solid ${THEME_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  padding-left: 8px;
  padding-right: 8px;
  width: 150px;
  height: 36px;
  background-color: ${WHITE};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${Text} {
    color: ${THEME_COLOR};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const PickerContainer = styled(Card)`
  min-width: 180px;
  margin-top: 5px;
  background-color: ${WHITE};
  position: absolute;
`;
