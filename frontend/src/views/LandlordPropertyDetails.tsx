import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Card } from '../core-ui';
import TenantDeepDiveModal from './DeepDivePage/TenantDeepDiveModal';
import {
  PropertyDetailHeader,
  PropertyDetailSegment,
  LandlordTenantMatches,
  LandlordLocationDetails,
} from './LandlordProfile';

const SPACES = ['Space 1'];

enum Tab {
  TENANT_MATCH_INDEX,
  LOCATION_DETAIL_INDEX,
}

export default function LandlordPropertyDetails() {
  let history = useHistory();
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0);
  let { address } = history.location.state;

  let isTenantMatchSelected = selectedTabIndex === Tab.TENANT_MATCH_INDEX;
  let isLocationDetailSelected = selectedTabIndex === Tab.LOCATION_DETAIL_INDEX;

  let [modalVisible, setModalVisible] = useState(false);
  return (
    <View flex>
      <PropertyDetailHeader
        spaces={SPACES}
        address={address}
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

const ContentWrapper = styled(View)`
  padding: 0 20px;
`;
