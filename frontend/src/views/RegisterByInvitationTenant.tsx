import React from 'react';
import styled from 'styled-components';

import { Card, View } from '../core-ui';
import { Role } from '../types/types';
import RegisterByInvitationForm from './SignUpPage/RegisterByInvitationForm';

type Params = {
  pendConvId: string;
};
export default function RegisterByInvitationTenant() {
  return (
    <Container>
      <ContainerCard title="Sign Up" mode="secondary">
        <RegisterByInvitationForm role={Role.TENANT} />
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
