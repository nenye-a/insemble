import React from 'react';
import styled from 'styled-components';
import { View, Text } from '../../core-ui';
import InsembleLogo from '../../components/common/InsembleLogo';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_LIGHT } from '../../constants/theme';
import { DARK_TEXT_COLOR } from '../../constants/colors';

export default function ThankYou() {
  return (
    <Container>
      <InsembleLogo color="purple" />
      <Description>
        Thank you for your listing your properties with Insemble. Your properties are live and you
        should begin receiving matched requests for your profile soon. In the mean time, check out
        your listing management profile here:
      </Description>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  align-items: flex-start;
  padding: 48px;
`;

const Description = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_LIGHT}
  margin: 16px 0 0 0;
  color:${DARK_TEXT_COLOR}
`;
