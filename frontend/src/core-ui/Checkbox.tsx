import React, { ComponentProps, useState, CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import View from './View';
import Label from './Label';
import Text from './Text';
import SvgCheck from '../components/icons/check';
import { THEME_COLOR, SECONDARY_CHECKBOX, WHITE, TEXT_COLOR } from '../constants/colors';
import { FONT_SIZE_SMALL } from '../constants/theme';
import useID from '../utils/useID';

type ViewProps = ComponentProps<typeof View>;
type TextProps = ComponentProps<typeof Text>;

type CheckboxProps = ViewProps & {
  type?: 'primary' | 'secondary';
  isChecked: boolean;
  onPress: () => void;
  title?: string;
  titleProps?: TextProps;
  size?: string;
  iconContainerStyle?: CSSProperties;
};

type ContainerProps = ViewProps & {
  isFocused: boolean;
};

type CheckProps = ComponentProps<typeof SvgCheck> & {
  isVisible: boolean;
  color: string;
};

const SIZE = '24px';
const BORDER_RADIUS = '5px';

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

const Container = styled(View)<ContainerProps>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: ${BORDER_RADIUS};
  ${(props) => (props.isFocused ? focusedStyles : undefined)};
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Backdrop = styled(View)`
  ${fillContainer};
  background-color: ${WHITE};
  border: 1px solid ${(props) => props.color};
  border-radius: ${BORDER_RADIUS};
`;

const Check = styled(SvgCheck)<CheckProps>`
  ${fillContainer};
  color: ${WHITE};
  background-color: ${(props) => props.color};
  border-radius: ${BORDER_RADIUS};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 150ms linear;
`;

const NativeCheckbox = styled.input.attrs(() => ({ type: 'checkbox' }))`
  margin: 0;
  border: 0;
  padding: 0;
  display: block;
  box-sizing: border-box;
  opacity: 0;
  cursor: pointer;
  ${fillContainer};
`;

const LabelText = styled(Label)`
  margin-left: 13px;
  font-size: ${FONT_SIZE_SMALL};
  color: ${TEXT_COLOR};
`;

export default function Checkbox(props: CheckboxProps) {
  let {
    isChecked,
    onPress,
    type = 'primary',
    title,
    titleProps,
    size = SIZE,
    iconContainerStyle,
    ...otherProps
  } = props;
  let [isFocused, setFocus] = useState(false);
  let color = type === 'primary' ? THEME_COLOR : SECONDARY_CHECKBOX;
  let id = useID();
  return (
    <RowedView {...otherProps}>
      <Container isFocused={isFocused} size={size} style={iconContainerStyle}>
        <Backdrop color={color} />
        <Check color={color} isVisible={isChecked} />
        <NativeCheckbox
          id={id}
          checked={isChecked}
          onClick={() => onPress()}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </Container>
      <LabelText text={title} id={id} {...titleProps} />
    </RowedView>
  );
}
