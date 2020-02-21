import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import LandingBackground from '../components/common/LandingBackground';
import { View, Text, Button } from '../core-ui';
import { WHITE } from '../constants/colors';
import {
  FONT_SIZE_XXLARGE,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_LIGHT,
} from '../constants/theme';

export default function LandlordLanding() {
  let history = useHistory();
  return (
    <Description>
      <LandingBackground />
      <RowView>
        <FindLocation
          text="Find the perfect location"
          mode="transparent"
          onPress={() => {
            history.push('/');
          }}
        />
      </RowView>
      <TextWrapper>
        <DescriptionLargeText>Find the perfect tenant for your property</DescriptionLargeText>
        <DescriptionSmallText>
          Insemble is the world’s first smart listing service. We connect clients to the best
          tenants for your property. We match clients using customer fit & space compatibility,
          saving time for brokers, owners, and retailers.
        </DescriptionSmallText>
      </TextWrapper>
    </Description>
  );
}

const RowView = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  position: absolute;
  top: 16px;
  right: 32px;
`;

const FindLocation = styled(Button)`
  margin: 0 12px 0 0;
  align-self: center;
  ${Text} {
    color: ${WHITE};
  }
`;

const Description = styled(View)`
  flex: 3;
`;

const DescriptionLargeText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_XXLARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  width: 340px;
  margin: 0 0 24px 0;
`;
const DescriptionSmallText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_LIGHT};
  width: 560px;
`;

const TextWrapper = styled(View)`
  position: absolute;
  top: 250px;
  left: 120px;
`;
