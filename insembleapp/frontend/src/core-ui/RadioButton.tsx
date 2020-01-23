import React from 'react';
import styled from 'styled-components';
import View from './View';
import { THEME_COLOR, SECONDARY_COLOR } from '../constants/colors';
import { FONT_FAMILY_NORMAL, FONT_SIZE_NORMAL } from '../constants/theme';

type Props = {
  option: string;
  name: string; //we need the name so we can mark them as a group
  isActive: () => void;
};

export default function RadioButton(props: Props) {
  let { option, isActive, name } = props;
  return (
    <RadioContainer>
      {option}
      <Radio value={option} name={name} onChange={isActive} />
      <CheckMark />
    </RadioContainer>
  );
}

const RadioContainer = styled.label`
  display: block;
  position: relative;
  padding-left: 30px;
  margin: 0 0 0 0;
  font-family:${FONT_FAMILY_NORMAL}
  font-size:${FONT_SIZE_NORMAL}
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Radio = styled.input.attrs(() => ({ type: 'radio' }))`
  ${RadioContainer} & {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
`;

const CheckMark = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: white;
  border-radius: 50%;
  color: ${SECONDARY_COLOR};
  border: solid;
  border-width: 1px;
  &: focus {
    box-shadow: 0 0 0.35rem rgba(0, 0, 0, 0.15);
  }
  &: after {
    content: '';
    position: absolute;
    display: none;
    background: white;
  }
  ${RadioContainer} ${Radio}:checked ~& {
    background-color: ${THEME_COLOR};
  }
  ${RadioContainer} ${Radio}:checked ~ &:after {
    display: block;
  }
  ${RadioContainer} &:after {
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
`;
