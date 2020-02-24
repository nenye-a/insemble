import React, { useState, ComponentProps } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Card, Text, PillButton, TouchableOpacity, TabBar } from '../core-ui';
import {
  DEFAULT_BORDER_RADIUS,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_SMALL,
  FONT_WEIGHT_HEAVY,
  FONT_WEIGHT_MEDIUM,
  FONT_SIZE_LARGE,
} from '../constants/theme';
import {
  WHITE,
  THEME_COLOR,
  SECONDARY_COLOR,
  TEXT_COLOR,
  BACKGROUND_COLOR,
  PURPLE,
  DARK_TEXT_COLOR,
} from '../constants/colors';
import { SAVED_SEARCHES, LANDLORD_PROPERTIES } from '../fixtures/dummyData';
import SvgPlus from '../components/icons/plus';
import imgPlaceholder from '../assets/images/image-placeholder.jpg';
import SvgRent from '../components/icons/rent';
import SvgSqft from '../components/icons/sqft';
import KeyFacts from './DeepDivePage/KeyFacts';
import LandlordTenantMatches from './LandlordProfile/LandlordTenantMatches';
import LandlordLocationDetails from './LandlordProfile/LandlordLocationDetails';
import DeepDiveModal from './DeepDivePage/DeepDiveModal';
import TenantDeepDiveModal from './DeepDivePage/TenantDeepDiveModal';
export default function LandlordPropertyDetails() {
  let history = useHistory();

  let TENANT_MATCH_INDEX = 0;
  let LOCATION_DETAIL_INDEX = 1;
  let MANAGE_INDEX = 2;

  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let isTenantMatchSelected = selectedTabIndex === TENANT_MATCH_INDEX;
  let isLocationDetailSelected = selectedTabIndex === LOCATION_DETAIL_INDEX;
  let isManageSelected = selectedTabIndex === MANAGE_INDEX;

  let [modalVisible, setModalVisible] = useState(false);
  return (
    <View flex>
      <Card>
        <HorizontalView>
          <TenantMatchSegment
            isActive={selectedTabIndex === TENANT_MATCH_INDEX}
            onPress={() => setSelectedTabIndex(TENANT_MATCH_INDEX)}
          >
            <TenantMatchText isActive={selectedTabIndex === TENANT_MATCH_INDEX}>
              Tenant Matches
            </TenantMatchText>
          </TenantMatchSegment>
          <TabSegment
            isActive={selectedTabIndex === LOCATION_DETAIL_INDEX}
            onPress={() => setSelectedTabIndex(LOCATION_DETAIL_INDEX)}
          >
            <SegmentText isActive={selectedTabIndex === LOCATION_DETAIL_INDEX}>
              Location Details
            </SegmentText>
          </TabSegment>
          <TabSegment
            isActive={selectedTabIndex === MANAGE_INDEX}
            onPress={() => setSelectedTabIndex(MANAGE_INDEX)}
          >
            <SegmentText isActive={selectedTabIndex === MANAGE_INDEX}>Manage</SegmentText>
          </TabSegment>
        </HorizontalView>

        {isTenantMatchSelected ? (
          <ContentWrapper>
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

const CardTitle = styled(Text)`
  color: ${PURPLE};
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;

const CardPercentage = styled(Text)`
  color: ${PURPLE};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_HEAVY};
`;

const CardCategoryText = styled(Text)`
  color: ${DARK_TEXT_COLOR};
  font-size: ${FONT_SIZE_SMALL};
`;

const CardExistingLocationText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;

const Image = styled.img`
  height: 120px;
  object-fit: cover;
`;

const TenantCard = styled(Card)`
  width: calc(33.33% - 11px);
  margin: 12px 16px 12px 0;
  &:nth-child(3n) {
    margin-right: 0;
  }
  height: fit-content;
`;
const DescriptionContainer = styled(View)`
  padding: 12px;
`;

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
const TenantRequestText = styled(Text)`
  color: ${SECONDARY_COLOR};
  font-weight: ${FONT_WEIGHT_BOLD};
`;

const HistoryContainer = styled(Card)`
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 6px 0;
`;

const LeftContainer = styled(View)`
  padding: 12px 24px;
  height: 150px;
`;

const HeatMapImage = styled.img`
  width: 200px;
  object-fit: contain;
`;

const AddButton = styled(TouchableOpacity)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  overflow: hidden;
  background-color: ${WHITE};
  justify-content: center;
  align-items: center;
  height: 48px;
  flex-direction: row;
`;
