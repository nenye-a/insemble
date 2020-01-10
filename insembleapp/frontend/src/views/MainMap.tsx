import React, { useState } from 'react';
import styled from 'styled-components';
import { View, Button } from '../core-ui';
import AvailableProperties from './MapPage/AvailableProperties';

const Container = styled(View)`
  flex-direction: row;
`;

export default function MainMap() {
  let [propertyRecommendationVisible, togglePropertyRecommendation] = useState(false);
  return (
    <Container flex>
      <ShowPropertyButton onClick={() => togglePropertyRecommendation(true)}>
        Show
      </ShowPropertyButton>
      <AvailableProperties
        visible={propertyRecommendationVisible}
        onHideClick={() => togglePropertyRecommendation(false)}
      />
    </Container>
  );
}

const ShowPropertyButton = styled(Button)`
  position: absolute;
  bottom: 30px;
  left: 50%;
  right: 50%;
`;
