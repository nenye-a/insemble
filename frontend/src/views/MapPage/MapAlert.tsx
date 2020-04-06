import React from 'react';
import styled from 'styled-components';

import { View, Alert } from '../../core-ui';

import { NAVBAR_HEIGHT } from '../../constants/theme';

type Props = {
  visible: boolean;
  text?: string;
};

export default function MapAlert({ visible, text }: Props) {
  return (
    <Root>
      <Container>
        <Alert visible={visible} text={text || 'An error occured. Please try again.'} />
      </Container>
    </Root>
  );
}

const Root = styled(View)`
  z-index: 5;
  left: 35%;
`;
const Container = styled(View)`
  position: absolute;
  left: 50%;
  width: 540px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: calc(100% - ${NAVBAR_HEIGHT});
`;
