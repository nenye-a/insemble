import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Card, Text, View, Button } from '../core-ui';
import LoginForm from './LoginForm';
import { Role } from '../types/types';

export default function Login() {
  let history = useHistory();
  let noAccount = "Don't have an account?";
  let noPassword = 'Forgot your password?';

  return (
    <Container>
      <LoginCard title="Tenant Log In" mode="secondary">
        <FormContainer>
          <LoginForm role={Role.TENANT} onboardingState={history.location.state?.onboardingState} />
        </FormContainer>
      </LoginCard>
      <NoAccountContainer>
        <Text>{noAccount} </Text>
        <Button
          mode="transparent"
          text="Sign Up here"
          onPress={() => {
            history.push('/signup', {
              onboardingState: history.location.state?.onboardingState,
            });
          }}
        />
      </NoAccountContainer>
      <RowView>
        <Text>{noPassword} </Text>
        <Button
          mode="transparent"
          text="Click here"
          onPress={() => {
            history.push('/forgot-password', {
              role: Role.TENANT,
            });
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
`;

const NoAccountContainer = styled(RowView)`
  margin: 16px 0 0 0;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoginCard = styled(Card)`
  width: 400px;
  // padding: 20px;
`;

const FormContainer = styled(View)`
  padding: 24px;
`;
