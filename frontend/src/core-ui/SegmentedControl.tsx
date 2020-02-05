import React, { ComponentProps, useState } from 'react';
import { View, Text } from '../core-ui';
import styled from 'styled-components';
import { TEXT_INPUT_BORDER_COLOR, THEME_COLOR, WHITE } from '../constants/colors';
import TouchableOpacity from './TouchableOpacity';

type Props = ViewProps & {
  options: Array<string>;
  selectedIndex: number;
};

export default function SegmentedControl(props: Props) {
  let { options, selectedIndex, ...otherProps } = props;
  let [active, setActive] = useState(0);
  let handleOnPress = (index: number) => {
    setActive(index);
    selectedIndex = index;
  };
  return (
    <RowedView {...otherProps}>
      <Text>Radius</Text>
      <SegmentContainer>
        {options.map((option, index) => (
          <Segment onPress={() => handleOnPress(index)} isActive={active === index} key={index}>
            {option}
          </Segment>
        ))}
      </SegmentContainer>
    </RowedView>
  );
}

type SegmentProps = ComponentProps<typeof TouchableOpacity> & {
  isActive: boolean;
};

const SegmentContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  height: 28px;
  border-radius: 5px;
  border: solid 0.5px;
  border-color: ${TEXT_INPUT_BORDER_COLOR};
  background-color: ${WHITE};
  margin: 0 0 0 12px;
`;
const Segment = styled(TouchableOpacity)<SegmentProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.isActive ? WHITE : THEME_COLOR)};
  outline: none;
  border-radius: ${(props) => (props.isActive ? '5px' : 'none')};
  background-color: ${(props) => (props.isActive ? THEME_COLOR : 'none')};
  box-shadow: ${(props) => (props.isActive ? '0px 0px 6px 0px rgba(0, 0, 0, 0.1)' : 'none')};
`;
const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;
