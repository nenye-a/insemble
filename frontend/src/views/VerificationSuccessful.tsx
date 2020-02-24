import React from 'react';
import styled from 'styled-components';

import { View, Text } from '../core-ui';
import InsembleLogo from '../components/common/InsembleLogo';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_LIGHT } from '../constants/theme';
import { DARK_TEXT_COLOR } from '../constants/colors';
import OnboardingCard from './OnboardingPage/OnboardingCard';

export default function VerificationSucessful() {
  return (
    <Container flex>
      <OnboardingCard title="Verify your email" progress={1} buttons={[]}>
        <ContentContainer flex={true}>
          <InsembleLogo color="purple" />
          <Description> You have successfully verified your account</Description>
        </ContentContainer>
      </OnboardingCard>
    </Container>
  );
}

const Container = styled(View)`
  align-items: center;
  margin: 24px;
`;
const ContentContainer = styled(View)`
  flex: 0;
  align-items: flex-start;
  padding: 48px;
`;

const Description = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_LIGHT}
  margin: 16px 0 0 0;
  color:${DARK_TEXT_COLOR}
`;
