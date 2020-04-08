import React from 'react';
import styled from 'styled-components';

import { View, Alert } from '../../core-ui';

type Props = {
  visible: boolean;
  text?: string;
  onClose?: () => void;
};

export default function MapAlert({ visible, text, onClose }: Props) {
  return (
    <Root>
      <Container>
        <Alert
          onClose={onClose}
          visible={visible}
          text={text || 'An error occured. Please try again.'}
        />
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
  width: 540px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
