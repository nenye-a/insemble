import React, { useState } from 'react';
import styled from 'styled-components';
import { View, Button } from '../core-ui';
import AvailableProperties from './MapPage/AvailableProperties';

const Container = styled(View)`
  flex-direction: row;
  overflow-x: hidden;
`;

export default function MainMap() {
  let [propertyRecommendationVisible, togglePropertyRecommendation] = useState(false);
  return (
    <Container flex>
      <ShowPropertyButton
        onPress={() => togglePropertyRecommendation(true)}
        text="Show Property List"
      />
      <AvailableProperties
        visible={propertyRecommendationVisible}
        onHideClick={() => togglePropertyRecommendation(false)}
      />
    </Container>
  );
}

const ShowPropertyButton = styled(Button)`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
`;
