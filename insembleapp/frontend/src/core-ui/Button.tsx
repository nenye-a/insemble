import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import { THEME_COLOR, WHITE } from '../constants/colors';
import { BUTTON_BORDER_COLOR, TEXT_COLOR } from '../constants/colors';
import TouchableOpacity from './TouchableOpacity';
import Text from './Text';

type TextProps = ComponentProps<typeof Text>;

type Props = ComponentProps<typeof TouchableOpacity> & {
  text: string;
  textProps: TextProps;
  mode?: 'primary' | 'secondary';
};

function Button(props: Props) {
  let { text, textProps, ...otherProps } = props;
  return (
    <TouchableOpacity forwardedAs="button" type="button" {...otherProps}>
      <Text as="span" color="white" {...textProps}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default styled(Button)<Props>`
  background-color: ${THEME_COLOR};
  border-radius: 4px;
  height: 36px;
  justify-content: center;
  padding: 0 12px;
  ${(props) =>
    props.mode === 'secondary' &&
    css`
      background-color: ${WHITE};
      border: 0.5px solid ${BUTTON_BORDER_COLOR};
      ${Text} {
        color: ${TEXT_COLOR};
      }
    `}
  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.5;
  }
`;
