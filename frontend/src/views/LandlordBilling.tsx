import React, { useState } from 'react';
import styled from 'styled-components';

import { THEME_COLOR } from '../constants/colors';
import { Text, Card, SegmentedControl } from '../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_MEDIUM } from '../constants/theme';
import LandlordBillingSummary from './LandlordPlan/LandlordBillingSummary';
import LandlordSpacePlans from './LandlordPlan/LandlordSpacePlans';

export default function LandlordBilling() {
  let [selectedTab, setSelectedTab] = useState(0);

  return (
    <Container flex>
      <Title>Billing & Plans</Title>
      <Tab
        containerStyle={{ borderWidth: 0, height: 36 }}
        options={['Space Plans', 'Billing Summary']}
        selectedIndex={selectedTab}
        onPress={(index: number) => {
          setSelectedTab(index);
        }}
      />

      {selectedTab === 0 ? <LandlordSpacePlans /> : <LandlordBillingSummary />}
    </Container>
  );
}

const Container = styled(Card)`
  padding: 24px;
`;
const Tab = styled(SegmentedControl)`
  width: 240px;
`;
const Title = styled(Text)`
  margin-bottom: 20px;
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_MEDIUM};
  color: ${THEME_COLOR};
`;
