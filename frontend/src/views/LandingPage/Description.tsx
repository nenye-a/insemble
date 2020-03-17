import React from 'react';
import styled from 'styled-components';
import { View, Text } from '../../core-ui';
import { FONT_WEIGHT_HEAVY, FONT_SIZE_XLARGE } from '../../constants/theme';
import { useViewport } from '../../utils';
import { VIEWPORT_TYPE } from '../../constants/viewports';

type ContainerProps = ViewProps & {
  isDesktop: boolean;
};

export default function Description() {
  let { viewportType } = useViewport();
  let isDesktop = viewportType === VIEWPORT_TYPE.DESKTOP;

  return (
    <Container isDesktop={isDesktop}>
      <CenteredText fontSize={isDesktop ? '32px' : FONT_SIZE_XLARGE} fontWeight={FONT_WEIGHT_HEAVY}>
        Find top line locations. Increase speed to market.
      </CenteredText>
      <CenteredText fontSize="20px" style={{ marginTop: 32 }}>
        We instantly find the right customers and locations for your brand, backed by powerful data.
        And we cut through the clutter, presenting the properties that matter the most.
      </CenteredText>
    </Container>
  );
}

const Container = styled(View)<ContainerProps>`
  justify-content: center;
  align-items: center;

  padding: ${(props) => (props.isDesktop ? '75px 20% 180px 20%' : '75px 24px 120px 24px')};
`;

const CenteredText = styled(Text)`
  text-align: center;
`;
