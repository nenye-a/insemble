import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import Text from './Text';
import View from './View';
import TouchableOpacity from './TouchableOpacity';
import { WHITE, BACKGROUND_COLOR, THEME_COLOR, TEXT_COLOR } from '../constants/colors';
import { FONT_WEIGHT_MEDIUM, FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';

type Props = {
  options: Array<string>;
  verticalMode?: boolean;
  activeTab: number;
  onPress: (index: number) => void;
  fullWidth?: boolean;
};

export default function TabBar(props: Props) {
  let { options, verticalMode, activeTab, onPress, fullWidth = true } = props;
  let isTabActive = activeTab === index;

  return verticalMode ? (
    <VerticalView>
      {options.map((option, index) => {
        return (
          <VerticalSegment key={index} onPress={() => onPress(index)}>
            <VerticalSegmentText isActive={isTabActive}>{option}</VerticalSegmentText>
          </VerticalSegment>
        );
      })}
      ;
    </VerticalView>
  ) : (
    <HorizontalView>
      {options.map((option, index) =>
        fullWidth ? (
          <FullWidthTabSegment isActive={isTabActive} key={index} onPress={() => onPress(index)}>
            <SegmentText isActive={isTabActive}>{option}</SegmentText>
          </FullWidthTabSegment>
        ) : (
          <TabSegment isActive={isTabActive} key={index} onPress={() => onPress(index)}>
            <SegmentText isActive={isTabActive}>{option}</SegmentText>
          </TabSegment>
        )
      )}
    </HorizontalView>
  );
}

type SegmentProps = ComponentProps<typeof TouchableOpacity> & {
  isActive: boolean;
};

const TabSegment = styled(TouchableOpacity)<SegmentProps>`
  padding: 20px;
  height: 36px;
  align-items: center;
  justify-content: center;
  &:focus {
    outline: none;
  }
  background-color: ${(props) => (props.isActive ? WHITE : BACKGROUND_COLOR)};
`;

const FullWidthTabSegment = styled(TabSegment)`
  flex: 1;
`;

const VerticalSegment = styled(TouchableOpacity)`
  &:focus {
    outline: none;
  }
  height: 36px;
  margin: 24px 0 0 16px;
`;

const VerticalView = styled(View)`
  background-color: ${THEME_COLOR};
  border-top-right-radius: 30px;
  width: 210px;
  height: 360px;
`;
const HorizontalView = styled(View)`
  flex-direction: row;
  width: 100%;
  height: 36px;
`;
const SegmentText = styled(Text)<SegmentProps>`
  color: ${(props) => (props.isActive ? THEME_COLOR : TEXT_COLOR)};
`;
const VerticalSegmentText = styled(Text)<SegmentProps>`
  color: ${WHITE};
  text-decoration: ${(props) => (props.isActive ? 'underline' : 'none')};
  font-weight: ${(props) => (props.isActive ? FONT_WEIGHT_MEDIUM : FONT_WEIGHT_NORMAL)};
  font-size: ${FONT_SIZE_MEDIUM};
`;
