import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { View, Text, Button } from '../core-ui';
import { WHITE } from '../constants/colors';
import {
  FONT_SIZE_XXLARGE,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_LIGHT,
} from '../constants/theme';
import { useViewport } from '../utils';
import { VIEWPORT_TYPE } from '../constants/viewports';

type ViewWithViewportType = ViewProps & {
  isDesktop: boolean;
};

export default function LandlordLanding() {
  let history = useHistory();
  let { viewportType } = useViewport();

  let isDesktop = VIEWPORT_TYPE.DESKTOP === viewportType;
  return (
    <Description>
      <FindLocation
        text="Retailer/Restaurant Portal"
        mode="transparent"
        onPress={() => {
          history.push('/');
        }}
      />
      <TextWrapper flex isDesktop={isDesktop}>
        <DescriptionLargeText>Find the perfect tenant for your property</DescriptionLargeText>
        <DescriptionSmallText>
          We help you find the best retailers for your property. We match clients using customer fit
          & space compatibility, saving time for brokers, owners, and retailers.
        </DescriptionSmallText>
      </TextWrapper>
    </Description>
  );
}

const FindLocation = styled(Button)`
  margin: 0 12px 0 0;
  position: absolute;
  top: 16px;
  right: 32px;
  z-index: 1;
  ${Text} {
    color: ${WHITE};
  }
`;

const Description = styled(View)`
  flex: 3;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://insemble-photos.s3.us-east-2.amazonaws.com/landlord-mh.jpg');
  background-size: cover;
  background-position-x: center;
  background-position-y: center;
  background-repeat: no-repeat;
  height: 100vh;
`;

const DescriptionLargeText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_XXLARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
`;

const DescriptionSmallText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_LIGHT};
  padding-top: 5%;
`;

const TextWrapper = styled(View)<ViewWithViewportType>`
  justify-content: center;
  align-content: center;
  padding: ${(props) => (props.isDesktop ? '0 20%' : '24px')};
`;
