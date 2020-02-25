import React, { useState, ComponentProps } from 'react';
import styled from 'styled-components';

import { View, Card, TouchableOpacity } from '../core-ui';
import TenantDeepDiveModal from './DeepDivePage/TenantDeepDiveModal';
import {
  PropertyDetailHeader,
  PropertyDetailSegment,
  LandlordTenantMatches,
  LandlordLocationDetails,
} from './LandlordProfile';

const SPACES = ['Space 1', 'Space 2'];

export default function LandlordPropertyDetails() {
  let TENANT_MATCH_INDEX = 0;
  let LOCATION_DETAIL_INDEX = 1;

  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let isTenantMatchSelected = selectedTabIndex === TENANT_MATCH_INDEX;
  let isLocationDetailSelected = selectedTabIndex === LOCATION_DETAIL_INDEX;

  let [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0);

  let [modalVisible, setModalVisible] = useState(false);
  return (
    <View flex>
      <PropertyDetailHeader
        spaces={SPACES}
        address="1004 West Slauson Avenue, Los Angeles"
        request="1"
        selectedSpaceIndex={selectedSpaceIndex}
        onPressSpace={(index: number) => setSelectedSpaceIndex(index)}
        onPressAdd={() => {}} // TODO
      />
      <Card>
        <PropertyDetailSegment
          selectedTabIndex={selectedTabIndex}
          onPress={(index: number) => setSelectedTabIndex(index)}
        />
        {isTenantMatchSelected ? (
          <ContentWrapper>
            {/* TODO: pass id */}
            <LandlordTenantMatches onPress={() => setModalVisible(true)} />
          </ContentWrapper>
        ) : isLocationDetailSelected ? (
          <LandlordLocationDetails />
        ) : null}
      </Card>
      <TenantDeepDiveModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

type SegmentProps = ComponentProps<typeof TouchableOpacity> & {
  isActive: boolean;
};

const ContentWrapper = styled(View)`
  padding: 0 20px;
`;
