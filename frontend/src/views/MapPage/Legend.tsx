import React from 'react';
import styled from 'styled-components';
import { View, Text } from '../../core-ui';
import availablePropertyIcon from '../../assets/images/available-property-marker.svg';
import recommendedPropertyIcon from '../../assets/images/recommended-property-marker.svg';

export default function Legend() {
  return (
    <RowedView>
      <Icon src={recommendedPropertyIcon} />
      <Text>Recommended Property</Text>
      <Icon src={availablePropertyIcon} />
      <Text>Available Property</Text>
    </RowedView>
  );
}

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Icon = styled.img`
  margin: 0px 12px;
`;
