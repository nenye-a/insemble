import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import { THEME_COLOR } from '../constants/colors';
import { FONT_FAMILY_NORMAL, FONT_SIZE_NORMAL } from '../constants/theme';

type ButtonProps = ComponentProps<'button'>;

function DefaultButton(props: ButtonProps) {
  return <button type="button" {...props} />;
}

const Button = styled(DefaultButton)`
  color: #fff;
  border: none;
  background-color: ${THEME_COLOR};
  box-shadow: none;
  border-radius: 4px;
  height: 36px;
  font-family: ${FONT_FAMILY_NORMAL};
  font-size: ${FONT_SIZE_NORMAL};
  padding-left: 12px;
  padding-right: 12px;
  &:hover {
    opacity: 0.9;
  }
`;

export default Button;
