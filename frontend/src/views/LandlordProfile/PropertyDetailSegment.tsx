import React, { ComponentProps } from 'react';
import styled from 'styled-components';

import { View, TouchableOpacity, Text } from '../../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR, WHITE, TEXT_COLOR } from '../../constants/colors';

type Props = {
  selectedTabIndex: number;
  onPress: (index: number) => void;
};
export default function PropertyDetailSegment({ selectedTabIndex, onPress }: Props) {
  let TENANT_MATCH_INDEX = 0;
  let LOCATION_DETAIL_INDEX = 1;
  let MANAGE_INDEX = 2;

  return (
    <HorizontalView>
      <TenantMatchSegment
        isActive={selectedTabIndex === TENANT_MATCH_INDEX}
        onPress={() => onPress(TENANT_MATCH_INDEX)}
      >
        <TenantMatchText isActive={selectedTabIndex === TENANT_MATCH_INDEX}>
          Tenant Matches
        </TenantMatchText>
      </TenantMatchSegment>
      <TabSegment
        isActive={selectedTabIndex === LOCATION_DETAIL_INDEX}
        onPress={() => onPress(LOCATION_DETAIL_INDEX)}
      >
        <SegmentText isActive={selectedTabIndex === LOCATION_DETAIL_INDEX}>
          Location Details
        </SegmentText>
      </TabSegment>
      <TabSegment
        isActive={selectedTabIndex === MANAGE_INDEX}
        onPress={() => onPress(MANAGE_INDEX)}
      >
        <SegmentText isActive={selectedTabIndex === MANAGE_INDEX}>Manage</SegmentText>
      </TabSegment>
    </HorizontalView>
  );
}

type SegmentProps = ComponentProps<typeof TouchableOpacity> & {
  isActive: boolean;
};

const HorizontalView = styled(View)`
  flex-direction: row;
  widht: 100%;
`;

const TenantMatchSegment = styled(TouchableOpacity)<SegmentProps>`
  flex: 2;
  height: 36px;
  align-items: center;
  justify-content: center;
  &:focus {
    outline: none;
  }
  background-color: ${(props) => (props.isActive ? THEME_COLOR : BACKGROUND_COLOR)};
`;

const TenantMatchText = styled(Text)<SegmentProps>`
  color: ${(props) => (props.isActive ? WHITE : TEXT_COLOR)};
`;

const TabSegment = styled(TouchableOpacity)<SegmentProps>`
  flex: 1;
  height: 36px;
  align-items: center;
  justify-content: center;
  &:focus {
    outline: none;
  }
  background-color: ${(props) => (props.isActive ? WHITE : BACKGROUND_COLOR)};
`;

const SegmentText = styled(Text)<SegmentProps>`
  color: ${(props) => (props.isActive ? THEME_COLOR : TEXT_COLOR)};
`;
