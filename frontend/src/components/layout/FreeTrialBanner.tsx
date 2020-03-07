import React from 'react';
import styled from 'styled-components';
import { THEME_COLOR, WHITE } from '../../constants/colors';

import { View, Text } from '../../core-ui';

type Props = {};

export default function FreeTrialBanner() {
  return (
    <Container>
      <Text color={WHITE}>Free Trial - (only available for Los Angeles)</Text>
    </Container>
  );
}

const Container = styled(View)`
  background-color: ${THEME_COLOR};
  height: 30px;
  align-items: center;
  justify-content: center;
`;
