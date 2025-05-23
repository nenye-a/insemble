import React, { Dispatch } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { View, Text, Button } from '../../core-ui';
import { WHITE, SECONDARY_COLOR } from '../../constants/colors';
import { FONT_SIZE_XLARGE, FONT_SIZE_SMALL, FONT_WEIGHT_BOLD } from '../../constants/theme';
import SignUpForm from '../SignUpPage/SignUpForm';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import InsembleLogo from '../../components/common/InsembleLogo';
import { Role } from '../../types/types';
import { useViewport } from '../../utils';

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function OnBoardingSignUp(props: Props) {
  let { state: onboardingState } = props;
  let { isDesktop } = useViewport();
  let history = useHistory();
  return (
    <Container>
      <FormContainer flex>
        <SignUpForm role={Role.TENANT} onboardingState={onboardingState} />
        <RowView style={{ marginBottom: 10 }}>
          <Text>Already have an account? </Text>
          <Button
            mode="transparent"
            text="Log in here"
            onPress={() => {
              history.push('/login', {
                onboardingState,
              });
            }}
          />
        </RowView>
      </FormContainer>
      {isDesktop && (
        <Description>
          <InsembleLogo color="white" />
          <DescriptionLargeText>
            Find the best location for your retail or restaurant business
          </DescriptionLargeText>
          <DescriptionSmallText>
            Insemble is the world’s first smart listing service. We find & connect you to the best
            locations for your business. And we cut through the clutter, presenting the pre-
            qualified properties that matter the most.
          </DescriptionSmallText>
        </Description>
      )}
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const RowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const FormContainer = styled(View)`
  padding: 24px 48px 0 48px;
`;

const Description = styled(View)`
  flex: 1;
  background-color: ${SECONDARY_COLOR};
  padding: 40px 40px 0 40px;
`;

const DescriptionLargeText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_XLARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 30px 0 0 0;
`;
const DescriptionSmallText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_SMALL};
  margin: 30px 0 0 0;
`;
