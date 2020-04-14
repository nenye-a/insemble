import React from 'react';
import styled from 'styled-components';

import { Card, View } from '../core-ui';
import ResetPasswordForm from './ForgotPasswordPage/ResetPasswordForm';
import { Role } from '../types/types';

export default function ResetPasswordTenant() {
  return (
    <Container>
      <ContainerCard title="New Password" mode="secondary">
        <ResetPasswordForm role={Role.TENANT} />
      </ContainerCard>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ContainerCard = styled(Card)`
  width: 400px;
  height: fit-content;
`;
