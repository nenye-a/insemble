import React from 'react';
import styled from 'styled-components';

import { View, Text, Button } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';

type Props = ViewProps & {
  text?: string;
  onRetry?: () => void;
};

export default function ErrorComponent({ text, onRetry, ...otherProps }: Props) {
  return (
    <Container flex {...otherProps}>
      <Text color={THEME_COLOR}>{text ? text : 'Something went wrong. Please try again'} </Text>
      <RetryButton onPress={onRetry} text="Try Again" />
    </Container>
  );
}

const Container = styled(View)`
  justify-content: center;
  align-items: center;
`;

const RetryButton = styled(Button)`
  margin-top: 12px;
`;
