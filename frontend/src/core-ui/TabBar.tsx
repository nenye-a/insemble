import React, { useState, ComponentProps } from 'react';
import styled from 'styled-components';
import { View, TouchableOpacity, Text } from '.';
import { WHITE, BACKGROUND_COLOR, THEME_COLOR, TEXT_COLOR } from '../constants/colors';
import { FONT_WEIGHT_MEDIUM, FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';

type Props = {
  options: Array<string>;
  verticalMode?: boolean;
  activeTab: number;
  onPress: (index: number) => void;
};

export default function TabBar(props: Props) {
  let { options, verticalMode, activeTab, onPress } = props;

  return verticalMode ? (
    <VerticalView>
      {options.map((option, index) => {
        return (
          <VerticalSegment onPress={() => onPress(index)}>
            <VerticalSegmentText isActive={activeTab === index}>{option}</VerticalSegmentText>
          </VerticalSegment>
        );
      })}
      ;
    </VerticalView>
  ) : (
    <HorizontalView>
      {options.map((option, index) => {
        return (
          <TabSegment isActive={activeTab === index} key={index} onPress={() => onPress(index)}>
            <SegmentText isActive={activeTab === index}>{option}</SegmentText>
          </TabSegment>
        );
      })}
    </HorizontalView>
  );
}

type SegmentProps = ComponentProps<typeof TouchableOpacity> & {
  isActive: boolean;
};

const TabSegment = styled(TouchableOpacity)<SegmentProps>`
  flex: 1;
  height: 36px;
  align-items: center;
  &:focus {
    outline: none;
  }
  background-color: ${(props) => (props.isActive ? WHITE : BACKGROUND_COLOR)};
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
  widht: 100%;
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
