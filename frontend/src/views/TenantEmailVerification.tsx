import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router-dom';

import { View, Text } from '../core-ui';
import InsembleLogo from '../components/common/InsembleLogo';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_LIGHT } from '../constants/theme';
import { DARK_TEXT_COLOR } from '../constants/colors';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import { TENANT_VERIFICATION } from '../graphql/queries/server/auth';
import { TenantVerification, TenantVerificationVariables } from '../generated/TenantVerification';
import { asyncStorage } from '../utils';

export default function TenantEmailVerification() {
  let history = useHistory();
  let { verificationId } = useParams();
  let { data } = useQuery<TenantVerification, TenantVerificationVariables>(TENANT_VERIFICATION, {
    pollInterval: 1000,
    variables: {
      id: verificationId || '',
    },
  });
  if (data) {
    let {
      tenantVerification: { verified, tenantAuth },
    } = data;
    if (verified && tenantAuth) {
      let { brandId, token } = tenantAuth;
      asyncStorage.saveTenantToken(token);
      asyncStorage.saveRole('Tenant');
      asyncStorage.saveBrandId(brandId);

      if (brandId) {
        history.push(`/map/${brandId}`);
      } else {
        history.push('/'); // TODO: maybe redirect user to other screen
      }
    }
  }
  return (
    <Container flex>
      <OnboardingCard title="Verify your email" progress={1} buttons={[]}>
        <ContentContainer flex={true}>
          <InsembleLogo color="purple" />
          <Description> Please verify your email to complete your registration</Description>
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
