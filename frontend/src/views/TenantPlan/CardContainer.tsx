import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { View, Text } from '../../core-ui';

import { WHITE, SECONDARY_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_WEIGHT_BOLD } from '../../constants/theme';

export default function CardContainer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Container>
      <CardTitleContainer>
        <Title>{title}</Title>
      </CardTitleContainer>
      {children}
    </Container>
  );
}

const Container = styled(View)`
  width: 300px;
  height: fit-content;
  flex: 1;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  box-shadow: 0px 0px 23px -11px rgba(0, 0, 0, 0.75);
`;

const Title = styled(Text)`
  color: ${WHITE};
  font-weight: ${FONT_WEIGHT_BOLD};
  font-size: ${FONT_SIZE_SMALL};
`;

export const CardTitleContainer = styled(View)`
  background-color: ${SECONDARY_COLOR};
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 5px;
`;
