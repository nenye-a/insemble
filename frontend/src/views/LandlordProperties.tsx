import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Card, Text, TouchableOpacity } from '../core-ui';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_BOLD } from '../constants/theme';
import { WHITE, THEME_COLOR, SECONDARY_COLOR } from '../constants/colors';
import { LANDLORD_PROPERTIES } from '../fixtures/dummyData';
import SvgPlus from '../components/icons/plus';
import imgPlaceholder from '../assets/images/image-placeholder.jpg';

export default function LandlordProperties() {
  let history = useHistory();
  return (
    <View flex>
      {LANDLORD_PROPERTIES.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={{ marginBottom: 24 }}
          onPress={() => {
            history.push(`/landlord/properties/${index}`); // TODO: change to brandID
          }}
        >
          <HistoryContainer>
            <LeftContainer flex>
              <RowedView>
                <Text>Property</Text>
                <Text>{item.propertyName}</Text>
              </RowedView>
              <RowedView>
                <Text># of Listing Spaces</Text>
                <Text>{item.listingSpaces}</Text>
              </RowedView>
              <RowedView>
                <Text># of Pro Spaces</Text>
                <Text>{item.proSpaces}</Text>
              </RowedView>
              <RowedView>
                <Text>New Tenant Requests</Text>
                <TenantRequestText>{item.tenantRequests} new request</TenantRequestText>
              </RowedView>
            </LeftContainer>
            {/* TODO: change to heatmap image/map */}
            <HeatMapImage src={imgPlaceholder} />
          </HistoryContainer>
        </TouchableOpacity>
      ))}
      <AddButton>
        <SvgPlus style={{ marginRight: 8, color: THEME_COLOR }} />
        <Text color={THEME_COLOR}>New Property</Text>
      </AddButton>
    </View>
  );
}

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
