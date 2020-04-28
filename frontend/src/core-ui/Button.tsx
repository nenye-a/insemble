import React, { ComponentProps, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  THEME_COLOR,
  WHITE,
  BUTTON_BORDER_COLOR,
  TEXT_COLOR,
  MUTED_TEXT_COLOR,
} from '../constants/colors';
import TouchableOpacity from './TouchableOpacity';
import Text from './Text';
import Badge from './Badge';
import LoadingIndicator from './LoadingIndicator';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';

type TextProps = ComponentProps<typeof Text>;

type Props = ComponentProps<typeof TouchableOpacity> & {
  text: string;
  textProps?: TextProps;
  mode?: 'primary' | 'secondary' | 'transparent' | 'withShadow';
  size?: 'small' | 'default';
  icon?: ReactNode;
  badgeText?: string;
  loading?: boolean;
  stopPropagation?: boolean;
};

export default function Button(props: Props) {
  let {
    mode = 'primary',
    size = 'default',
    text,
    textProps,
    icon,
    badgeText,
    loading,
    disabled,
    stopPropagation,
    ...otherProps
  } = props;
  return (
    <Container
      forwardedAs="button"
      type="button"
      disabled={loading || disabled}
      mode={mode}
      onStopPropagation={stopPropagation}
      size={size}
      {...otherProps}
    >
      {loading ? (
        <LoadingIndicator color={mode === 'primary' ? 'white' : 'purple'} />
      ) : (
        <>
          {icon}
          <Text as="span" color="white" {...textProps}>
            {text}
          </Text>
        </>
      )}
      {badgeText && <ButtonBadge text={badgeText} />}
    </Container>
  );
}

const Container = styled(TouchableOpacity)<Props>`
  background-color: ${THEME_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  justify-content: center;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
  height: ${(props) => (props.size === 'default' ? '36px' : '28px')}
  ${(props) =>
    props.mode === 'primary' &&
    css`
      &:disabled {
        background-color: ${MUTED_TEXT_COLOR};
      }
    `}
  ${(props) =>
    props.mode === 'secondary' &&
    css`
      background-color: ${WHITE};
      border: 0.8px solid ${BUTTON_BORDER_COLOR};
      ${Text} {
        color: ${TEXT_COLOR};
      }
    `}
  ${(props) =>
    props.mode === 'transparent' &&
    css`
      padding: 0;
      background-color: transparent;
      ${Text} {
        color: ${THEME_COLOR};
      }
      &:disabled ${Text} {
        color: ${MUTED_TEXT_COLOR};
      }
    `}
    ${(props) =>
      props.mode === 'withShadow' &&
      css`
        background-color: transparent;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
        ${Text} {
          color: ${THEME_COLOR};
        }
        &:disabled ${Text} {
          color: ${MUTED_TEXT_COLOR};
        }
      `}
  &:hover, &:not():disabled {
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
