import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { View, Text, Button } from '../core-ui';
import LandlordLanding from './LandlordLanding';
import SignUpForm from './SignUpPage/SignUpForm';
import { Role } from '../types/types';
import { WHITE, THEME_COLOR } from '../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../constants/theme';
import { useViewport } from '../utils';
import { VIEWPORT_TYPE } from '../constants/viewports';

type ViewWithViewportType = ViewProps & {
  isDesktop: boolean;
};

export default function LandlordSignUp() {
  let history = useHistory();
  let { viewportType } = useViewport();
  return (
    <Container isDesktop={viewportType === VIEWPORT_TYPE.DESKTOP}>
      <LandlordLanding />
      <RightContainer flex>
        <TitleText>Landlord Sign Up</TitleText>
        <SignUpForm role={Role.LANDLORD} />
        <SignUpRowView>
          <Text>Already have an account? </Text>
          <Button
            mode="transparent"
            text="Log in here"
            onPress={() => {
              history.push('/landlord/login');
            }}
          />
        </SignUpRowView>
      </RightContainer>
    </Container>
  );
}

const Container = styled(View)<ViewWithViewportType>`
  flex-direction: ${(props) => (props.isDesktop ? 'row' : 'column')};
`;

const SignUpRowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const RightContainer = styled(View)`
  justify-content: center;
  padding: 10px 50px;
  background-color: ${WHITE};
`;
const TitleText = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 30px 0 20px 0;
  color: ${THEME_COLOR};
`;
