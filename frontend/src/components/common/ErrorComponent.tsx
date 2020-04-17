import React from 'react';
import styled from 'styled-components';

import { View, Text, Button } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { SUPPORT_EMAIL } from '../../constants/app';

type Props = ViewProps & {
  text?: string;
  onRetry?: () => void;
};

export default function ErrorComponent({ text, onRetry, ...otherProps }: Props) {
  return (
    <Container flex {...otherProps}>
      <Text color={THEME_COLOR}>
        {text ? text : `An error has occurred. Please try again or contact ${SUPPORT_EMAIL}`}
      </Text>
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
