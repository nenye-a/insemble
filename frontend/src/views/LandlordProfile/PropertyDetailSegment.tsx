import React, { ComponentProps } from 'react';
import styled from 'styled-components';

import { View, TouchableOpacity, Text } from '../../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR, WHITE, TEXT_COLOR } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';

type Props = {
  selectedTabIndex: number;
  onPress: (index: number) => void;
};

enum Tab {
  TENANT_MATCH_INDEX,
  LOCATION_DETAIL_INDEX,
  MANAGE_SPACE_INDEX,
  MANAGE_PROPERTY_INDEX,
}

export default function PropertyDetailSegment({ selectedTabIndex, onPress }: Props) {
  return (
    <HorizontalView>
      <TenantMatchSegment
        isActive={selectedTabIndex === Tab.TENANT_MATCH_INDEX}
        onPress={() => onPress(Tab.TENANT_MATCH_INDEX)}
      >
        <TenantMatchText isActive={selectedTabIndex === Tab.TENANT_MATCH_INDEX}>
          Tenant Matches
        </TenantMatchText>
      </TenantMatchSegment>
      <TabSegment
        isActive={selectedTabIndex === Tab.LOCATION_DETAIL_INDEX}
        onPress={() => onPress(Tab.LOCATION_DETAIL_INDEX)}
      >
        <SegmentText isActive={selectedTabIndex === Tab.LOCATION_DETAIL_INDEX}>
          Location Details
        </SegmentText>
      </TabSegment>
      <TabSegment
        isActive={selectedTabIndex === Tab.MANAGE_SPACE_INDEX}
        onPress={() => onPress(Tab.MANAGE_SPACE_INDEX)}
      >
        <SegmentText isActive={selectedTabIndex === Tab.MANAGE_SPACE_INDEX}>
          Manage Space
        </SegmentText>
      </TabSegment>
      <TabSegment
        isActive={selectedTabIndex === Tab.MANAGE_PROPERTY_INDEX}
        onPress={() => onPress(Tab.MANAGE_PROPERTY_INDEX)}
      >
        <SegmentText isActive={selectedTabIndex === Tab.MANAGE_PROPERTY_INDEX}>
          Manage Property
        </SegmentText>
      </TabSegment>
    </HorizontalView>
  );
}

type SegmentProps = ComponentProps<typeof TouchableOpacity> & {
  isActive: boolean;
};

const HorizontalView = styled(View)`
  flex-direction: row;
  width: 100%;
`;

const TenantMatchSegment = styled(TouchableOpacity)<SegmentProps>`
  flex: 2;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${DEFAULT_BORDER_RADIUS};
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
  &:last-child {
    border-top-right-radius: ${DEFAULT_BORDER_RADIUS};
  }
  background-color: ${(props) => (props.isActive ? WHITE : BACKGROUND_COLOR)};
`;

const SegmentText = styled(Text)<SegmentProps>`
  color: ${(props) => (props.isActive ? THEME_COLOR : TEXT_COLOR)};
`;
