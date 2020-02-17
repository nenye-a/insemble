import React, { useState } from 'react';
import styled from 'styled-components';

import { View, Button, Text } from '../core-ui';
import AvailableProperties from './MapPage/AvailableProperties';
import SideBarFilters from './MapPage/SideBarFilters';
import HeaderFilterBar from './MapPage/HeaderFilterBar';
import MapContainer from './MapContainer';
import DeepDiveModal from './DeepDivePage/DeepDiveModal';
import { WHITE, THEME_COLOR, HEADER_BORDER_COLOR } from '../constants/colors';
import { FONT_WEIGHT_MEDIUM } from '../constants/theme';
import SvgPropertyLocation from '../components/icons/property-location';
import { useSelector } from '../redux/helpers';

export default function MainMap() {
  let [propertyRecommendationVisible, togglePropertyRecommendation] = useState(false);
  let [deepDiveModalVisible, toggleDeepDiveModal] = useState(false);

  return (
    <View flex>
      <DeepDiveModal
        visible={deepDiveModalVisible}
        onClose={() => toggleDeepDiveModal(!deepDiveModalVisible)}
      />
      <HeaderFilterBar />

      <Container flex>
        <ShowPropertyButton
          mode="secondary"
          onPress={() => togglePropertyRecommendation(true)}
          text="Show Property List"
          icon={<SvgPropertyLocation />}
        />
        <SideBarFilters />
        <MapContainer onMarkerClick={() => toggleDeepDiveModal(true)} />
        <AvailableProperties
          visible={propertyRecommendationVisible}
          onHideClick={() => togglePropertyRecommendation(false)}
        />
      </Container>
    </View>
  );
}

const Container = styled(View)`
  flex-direction: row;
  overflow-x: hidden;
`;

const ShowPropertyButton = styled(Button)`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 5;
  background-color: ${WHITE};
  border-radius: 18px;
  border: none;
  box-shadow: 0px 0px 6px 0px ${HEADER_BORDER_COLOR};
  ${Text} {
    color: ${THEME_COLOR};
    font-weight: ${FONT_WEIGHT_MEDIUM};
  }
`;
