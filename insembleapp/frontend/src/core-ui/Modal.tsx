import React, { ReactNode, ComponentProps } from 'react';
import styled from 'styled-components';
import View from './View';
import TouchableOpacity from './TouchableOpacity';
import { WHITE } from '../constants/colors';
import SvgClose from '../components/icons/close';

type Props = ComponentProps<typeof View> & {
  children: ReactNode;
  onClosePress?: () => void;
};
export default function Modal(props: Props) {
  let { children, onClosePress, ...otherProps } = props;
  return (
    <Container>
      <ModalDialog {...otherProps}>
        <CloseIcon onPress={onClosePress}>
          <SvgClose />
        </CloseIcon>
        {children}
      </ModalDialog>
    </Container>
  );
}

const Container = styled(View)`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  align-items: center;
`;

const ModalDialog = styled(View)`
  background: ${WHITE};
  width: 960px;
  height: 100%;
`;

const CloseIcon = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 99;
`;
