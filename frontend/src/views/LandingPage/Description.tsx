import React from 'react';
import styled from 'styled-components';
import { View, Text } from '../../core-ui';
import { FONT_WEIGHT_HEAVY } from '../../constants/theme';

export default function Description() {
  return (
    <Container>
      <CenteredText fontSize="32px" fontWeight={FONT_WEIGHT_HEAVY}>
        Find top line locations. Increase speed to market.
      </CenteredText>
      <CenteredText fontSize="20px" style={{ marginTop: 32 }}>
        We instantly find the right customers and locations for your brand, backed by powerful data.
        And we cut through the clutter, presenting the properties that matter the most.
      </CenteredText>
    </Container>
  );
}

const Container = styled(View)`
  justify-content: center;
  align-items: center;
  padding: 75px 20%;
`;

const CenteredText = styled(Text)`
  text-align: center;
`;
