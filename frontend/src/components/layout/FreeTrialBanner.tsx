import React from 'react';
import styled from 'styled-components';

import { THEME_COLOR, WHITE, HIGHLIGHTED_BANNER_BACKGROUND } from '../../constants/colors';
import { View, Text } from '../../core-ui';

export default function FreeTrialBanner() {
  return (
    <Container>
      <Text color={WHITE}>Free Trial - (only available for Los Angeles)</Text>
    </Container>
  );
}

type ContainerProps = ViewProps & {
  highlight: boolean;
};

const Container = styled(View)<ContainerProps>`
  height: 30px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.highlight ? HIGHLIGHTED_BANNER_BACKGROUND : THEME_COLOR)};
`;
