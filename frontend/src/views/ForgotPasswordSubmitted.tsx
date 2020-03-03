import React from 'react';
import styled from 'styled-components';

import { Card, Text, View } from '../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';

export default function ForgotPasswordSubmitted() {
  return (
    <Container>
      <ContainerCard
        titleContainerProps={{ style: { textAlign: 'center', height: 54 } }}
        title="Recover Password"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        <Content>
          <Text>
            If we found an account associated with that username, we’ve sent password reset
            instructions to the primary email address on the account.
          </Text>
        </Content>
      </ContainerCard>
    </Container>
  );
}

const Content = styled(View)`
  padding: 24px;
  width: 100%;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ContainerCard = styled(Card)`
  width: 400px;
  height: 300px;
  // padding: 20px;
`;
