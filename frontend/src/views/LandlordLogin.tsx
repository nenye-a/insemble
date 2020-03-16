import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { View, Text, Button } from '../core-ui';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE } from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';
import LoginForm from '../views/LoginForm';
import { Role } from '../types/types';
import LandlordLanding from './LandlordLanding';

export default function LandlordSignUp() {
  let history = useHistory();
  let noAccount = "Don't have an account?";
  let noPassword = 'Forgot your password?';
  return (
    <Container>
      <LandlordLanding />
      <FormContainer>
        <TitleText>Landlord Log In</TitleText>
        <LoginForm role={Role.LANDLORD} />
        <NoAccountContainer>
          <Text>{noAccount} </Text>
          <Button
            mode="transparent"
            text="Sign Up here"
            onPress={() => {
              history.push('/landlord/signup');
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
                role: Role.LANDLORD,
              });
            }}
          />
        </RowView>
      </FormContainer>
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  height: 100vh;
`;

const FormContainer = styled(View)`
  flex: 1;
  justify-content: center;
  background-color: ${WHITE};
  padding: 10px 50px 0 50px;
`;

const TitleText = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 30px 0 20px 0;
  color: ${THEME_COLOR};
`;

const RowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const NoAccountContainer = styled(RowView)`
  margin: 24px 0 0 0;
`;
