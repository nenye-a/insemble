import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Card, Text, View, Button } from '../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import LoginForm from './LoginForm';

export default function Login() {
  let history = useHistory();
  let noAccount = "Don't have an account?";

  return (
    <Container>
      <LoginCard
        titleContainerProps={{ style: { textAlign: 'center', height: 54 } }}
        title="Log In"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        <LoginForm role="Tenant" />
      </LoginCard>
      <RowView>
        <Text>{noAccount} </Text>
        <Button
          mode="transparent"
          text="Sign Up here"
          onPress={() => {
            history.push('/signup');
          }}
        />
      </RowView>
    </Container>
  );
}

const RowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 16px 0 0 0;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoginCard = styled(Card)`
  width: 360px;
`;
