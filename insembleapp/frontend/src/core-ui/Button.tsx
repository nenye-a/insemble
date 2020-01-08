import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import { THEME_COLOR } from '../constants/colors';

type ButtonProps = ComponentProps<'button'>;

const Button = styled(DefaultButton)`
  color: #fff;
  border: none;
  background-color: ${THEME_COLOR};
  box-shadow: none;
  border-radius: 4px;
  height: 36px;
  /* TODO: font-family */
  font-size: 14px;
  padding-left: 12px;
  padding-right: 12px;
  &:hover {
    opacity: 0.9;
  }
`;

function DefaultButton(props: ButtonProps) {
  return <button type="button" {...props} />;
}

export default Button;
