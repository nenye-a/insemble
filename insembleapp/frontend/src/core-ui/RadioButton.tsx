import React, { ComponentProps, useState } from 'react';
import styled, { css } from 'styled-components';
import View from './View';
import Text from './Text';
import { THEME_COLOR, WHITE } from '../constants/colors';

type ViewProps = ComponentProps<typeof View>;

type Props = ViewProps & {
  name: string;
  title: string;
  isSelected: boolean;
  onPress: () => void;
};

type RadioContainerProps = ViewProps & {
  isFocused: boolean;
};

type StyledRadioProps = ViewProps & {
  isVisible: boolean;
};

const SIZE = 18;
const BORDER_RADIUS = SIZE / 2;

const fillContainer = css`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const focusedStyles = css`
  box-shadow: 0 0 0.35rem rgba(0, 0, 0, 0.15);
`;

const RadioContainer = styled(View)<RadioContainerProps>`
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: ${BORDER_RADIUS}px;
  ${(props) => (props.isFocused ? focusedStyles : undefined)}
`;

const Backdrop = styled(View)`
  ${fillContainer};
  background-color: ${WHITE};
  border: 1px solid ${THEME_COLOR};
  border-radius: ${BORDER_RADIUS}px;
`;

const StyledRadio = styled(View)<StyledRadioProps>`
  ${fillContainer};
  background-color: ${WHITE};
  background-clip: padding-box;
  border: 5px solid ${THEME_COLOR};
  border-radius: ${BORDER_RADIUS}px;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 150ms linear;
`;

const NativeRadio = styled.input.attrs(() => ({ type: 'radio' }))`
  margin: 0;
  border: 0;
  padding: 0;
  display: block;
  box-sizing: border-box;
  opacity: 0;
  cursor: pointer;
  ${fillContainer};
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const TextLabel = styled(Text)`
  padding-left: 6px;
  /* Adding padding-top to make it look more centered */
  padding-top: 1px;
  cursor: pointer;
`;

export default function RadioButton(props: Props) {
  let { name, id, title, isSelected, onPress, ...otherProps } = props;
  let [isFocused, setFocus] = useState(false);
  return (
    <Row {...otherProps}>
      <RadioContainer isFocused={isFocused}>
        <Backdrop />
        <StyledRadio isVisible={isSelected} />
        <NativeRadio
          id={id}
          name={name}
          checked={isSelected}
          onChange={onPress}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </RadioContainer>
      <TextLabel as="label" htmlFor={id}>
        {title}
      </TextLabel>
    </Row>
  );
}
