import React, { ReactNode, ComponentProps, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import View from './View';
import TouchableOpacity from './TouchableOpacity';
import { WHITE } from '../constants/colors';
import SvgClose from '../components/icons/close';

type Props = ComponentProps<typeof View> & {
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
  overlayStyle?: CSSProperties;
};

export default function Modal({ onClose, children, visible, overlayStyle, ...otherProps }: Props) {
  if (visible) {
    return ReactDOM.createPortal(
      <Overlay style={overlayStyle}>
        <ModalDialog aria-modal role="dialog" {...otherProps}>
          <CloseIcon onPress={onClose}>
            <SvgClose />
          </CloseIcon>
          {children}
        </ModalDialog>
      </Overlay>,
      document.body
    );
  }
  return null;
}

const Overlay = styled(View)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  align-items: center;
  justify-content: center;
`;

const ModalDialog = styled(View)`
  background-color: ${WHITE};
  width: 960px;
  height: 100%;
`;

const CloseIcon = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 99;
`;
