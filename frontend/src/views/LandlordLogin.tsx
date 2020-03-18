import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { View, Text, Button } from '../core-ui';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE } from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';
import { VIEWPORT_TYPE } from '../constants/viewports';
import LoginForm from '../views/LoginForm';
import LandlordLanding from './LandlordLanding';
import { Role } from '../types/types';
import { useViewport } from '../utils';

type ContainerProps = ViewProps & {
  isDesktop: boolean;
};

export default function LandlordSignUp() {
  let history = useHistory();
  let { viewportType } = useViewport();
  let isDesktop = viewportType === VIEWPORT_TYPE.DESKTOP;
  let noAccount = "Don't have an account?";
  let noPassword = 'Forgot your password?';
  return (
    <Container isDesktop={isDesktop}>
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

const Container = styled(View)<ContainerProps>`
  flex-direction: ${(props) => (props.isDesktop ? 'row' : 'column')};
`;

const FormContainer = styled(View)`
  flex: 1;
  justify-content: center;
  background-color: ${WHITE};
  padding: 10px 50px;
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
