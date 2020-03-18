import React from 'react';
import styled from 'styled-components';
import { View, Text, Button } from '../../core-ui';
import { useViewport } from '../../utils';
import { FONT_WEIGHT_HEAVY, FONT_SIZE_LARGE, FONT_SIZE_XLARGE } from '../../constants/theme';
import { VIEWPORT_TYPE } from '../../constants/viewports';

type ContainerProps = ViewProps & {
  isDesktop: boolean;
};

export default function SpeedUpLeasing() {
  let { viewportType } = useViewport();
  let isDesktop = viewportType === VIEWPORT_TYPE.DESKTOP;

  return (
    <Container isDesktop={isDesktop}>
      <CenteredText fontSize={isDesktop ? '32px' : FONT_SIZE_XLARGE} fontWeight={FONT_WEIGHT_HEAVY}>
        Speed up your leasing
      </CenteredText>
      <CenteredText fontSize="20px" style={{ marginTop: 32, marginBottom: 32 }}>
        At Insemble, we believe in helping you open the best stores as fast as possible. We start by
        giving custom market insights, and followup with properties that work best for you.
      </CenteredText>
      <FindLocationsButton
        text="Find Locations"
        textProps={{ fontSize: FONT_SIZE_LARGE }}
        onPress={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
      />
    </Container>
  );
}

const Container = styled(View)<ContainerProps>`
  justify-content: center;
  align-items: center;
  padding: ${({ isDesktop }) => (isDesktop ? '75px 20%' : '42px 24px 84px 24px')};
`;

const CenteredText = styled(Text)`
  text-align: center;
`;

const FindLocationsButton = styled(Button)`
  border-radius: 30px;
  padding: 0 10%;
  height: 60px;
`;
