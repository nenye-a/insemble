import React from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { View, Text } from '../core-ui';
import InsembleLogo from '../components/common/InsembleLogo';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_LIGHT } from '../constants/theme';
import { DARK_TEXT_COLOR } from '../constants/colors';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import { asyncStorage } from '../utils';
import { LANDLORD_VERIFICATION } from '../graphql/queries/server/auth';
import {
  LandlordRegisterVerification,
  LandlordRegisterVerificationVariables,
} from '../generated/LandlordRegisterVerification';
import { Role } from '../types/types';

export default function LandlordEmailVerification() {
  let { verificationId } = useParams();
  let history = useHistory();
  let { data } = useQuery<LandlordRegisterVerification, LandlordRegisterVerificationVariables>(
    LANDLORD_VERIFICATION,
    {
      pollInterval: 1000,
      variables: {
        id: verificationId || '',
      },
    }
  );
  if (data) {
    let {
      landlordRegisterVerification: { verified, landlordAuth },
    } = data;
    if (verified && landlordAuth) {
      let { token } = landlordAuth;
      asyncStorage.saveLandlordToken(token);
      asyncStorage.saveRole(Role.LANDLORD);
      history.push('/landlord/new-property/step-1');
    }
  }
  return (
    <Container flex>
      <OnboardingCard title="Verify your email" progress={1} buttons={[]}>
        <ContentContainer flex={true}>
          <InsembleLogo color="purple" />
          <Description>
            We have sent an email with a verification link to you. Please follow the instructions to
            complete your registration.
          </Description>
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
