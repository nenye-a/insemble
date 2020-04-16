import React from 'react';
import styled from 'styled-components';

import { Card, Text, View } from '../core-ui';

export default function ForgotPasswordSubmitted() {
  return (
    <Container>
      <ContainerCard title="Recover Password" mode="secondary">
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
`;
