import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Button, Card } from '../core-ui';
import SignUpForm from './SignUpPage/SignUpForm';
import { Role } from '../types/types';

export default function OnBoardingSignUp() {
  let history = useHistory();

  return (
    <Container>
      <Card title="Sign Up" mode="secondary">
        <FormContainer>
          <SignUpForm
            role={Role.TENANT}
            onboardingState={history.location.state?.onboardingState}
          />
        </FormContainer>
      </Card>
      <RowView style={{ marginTop: 16 }}>
        <Text>Already have an account? </Text>
        <Button
          mode="transparent"
          text="Log in here"
          onPress={() => {
            history.push('/login', {
              onboardingState: history.location.state.onboardingState,
            });
          }}
        />
      </RowView>
    </Container>
  );
}

const FormContainer = styled(View)`
  padding: 10px 50px 0 50px;
`;

const RowView = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
