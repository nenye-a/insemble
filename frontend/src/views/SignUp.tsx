import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Button, Card } from '../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import SignUpForm from './SignUpPage/SignUpForm';

export default function OnBoardingSignUp() {
  let history = useHistory();

  return (
    <Container>
      <Card
        titleContainerProps={{
          style: { textAlign: 'center', height: 54 },
        }}
        title="Sign Up"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        <SignUpForm role="Tenant" />
      </Card>
      <RowView style={{ marginTop: 16 }}>
        <Text>Already have an account? </Text>
        <Button
          mode="transparent"
          text="Log in here"
          onPress={() => {
            history.push('/login');
          }}
        />
      </RowView>
    </Container>
  );
}

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
