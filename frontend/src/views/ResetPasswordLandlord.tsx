import React from 'react';
import styled from 'styled-components';

import { Card, View } from '../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import ResetPasswordForm from './ResetPasswordForm';
import { Role } from '../types/types';

export default function ResetPasswordLandlord() {
  return (
    <Container>
      <ContainerCard
        titleContainerProps={{ style: { textAlign: 'center', height: 54 } }}
        title="New Password"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        <ResetPasswordForm role={Role.LANDLORD} />
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
