import React, { ComponentProps, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { THEME_COLOR, WHITE } from '../constants/colors';
import { BUTTON_BORDER_COLOR, TEXT_COLOR } from '../constants/colors';
import TouchableOpacity from './TouchableOpacity';
import Text from './Text';
import Badge from './Badge';

type TextProps = ComponentProps<typeof Text>;

type Props = ComponentProps<typeof TouchableOpacity> & {
  text: string;
  textProps?: TextProps;
  mode?: 'primary' | 'secondary';
  icon?: ReactNode;
  badgeText?: string;
};

function Button(props: Props) {
  let { text, textProps, icon, badgeText, ...otherProps } = props;
  return (
    <TouchableOpacity forwardedAs="button" type="button" {...otherProps}>
      {icon}
      <Text as="span" color="white" {...textProps}>
        {text}
      </Text>
      {badgeText && <ButtonBadge text={badgeText} />}
    </TouchableOpacity>
  );
}

export default styled(Button)<Props>`
  background-color: ${THEME_COLOR};
  border-radius: 4px;
  height: 36px;
  justify-content: center;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
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

const ButtonBadge = styled(Badge)`
  position: absolute;
  top: -6px;
  right: -4px;
`;
