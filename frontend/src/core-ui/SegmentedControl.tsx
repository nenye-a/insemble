import React, { ComponentProps, CSSProperties } from 'react';
import styled from 'styled-components';
import View from './View';
import Text from './Text';
import TouchableOpacity from './TouchableOpacity';
import { TEXT_INPUT_BORDER_COLOR, THEME_COLOR, WHITE } from '../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';

type Props = ViewProps & {
  options: Array<string>;
  selectedIndex: number;
  onPress: (index: number) => void;
  activeSegmentStyle?: CSSProperties;
  segmentStyle?: CSSProperties;
  activeTextStyle?: CSSProperties;
  textStyle?: CSSProperties;
};

export default function SegmentedControl(props: Props) {
  let {
    options,
    selectedIndex,
    onPress,
    containerStyle,
    activeSegmentStyle,
    segmentStyle,
    activeTextStyle,
    textStyle,
    ...otherProps
  } = props;

  return (
    <SegmentContainer style={containerStyle} {...otherProps}>
      {options.map((option, index) => {
        let isActive = selectedIndex === index;
        return (
          <Segment
            onPress={() => onPress(index)}
            isActive={isActive}
            key={index}
            style={isActive ? activeSegmentStyle : segmentStyle}
          >
            <Text style={isActive ? activeTextStyle : textStyle}>{option}</Text>
          </Segment>
        );
      })}
    </SegmentContainer>
  );
}

type SegmentProps = ComponentProps<typeof TouchableOpacity> & {
  isActive: boolean;
};

const SegmentContainer = styled(View)`
  flex-direction: row;
  height: 28px;
  border-radius: ${DEFAULT_BORDER_RADIUS};
  border: solid 1px;
  border-color: ${TEXT_INPUT_BORDER_COLOR};
  background-color: ${WHITE};
`;

const Segment = styled(TouchableOpacity)<SegmentProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  outline: none;
  border-radius: ${(props) => (props.isActive ? DEFAULT_BORDER_RADIUS : 'none')};
  background-color: ${(props) => (props.isActive ? THEME_COLOR : 'none')};
  box-shadow: ${(props) => (props.isActive ? '0px 0px 6px 0px rgba(0, 0, 0, 0.1)' : 'none')};
  ${Text} {
    color: ${(props) => (props.isActive ? WHITE : THEME_COLOR)};
  }
`;
