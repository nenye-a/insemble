import React, { ComponentProps, useCallback } from 'react';
import styled, { css } from 'styled-components';

type PressHandler = () => void;

type Props = Omit<ComponentProps<'span'>, 'onClick' | 'ref'> & {
  href?: string;
  onPress?: PressHandler;
};

function Touchable(props: Props) {
  let { href, onPress, ...otherProps } = props;
  let onClick = useCallback(
    (event) => {
      if (onPress) {
        event.preventDefault();
        onPress();
      }
    },
    [onPress]
  );
  return href == null ? (
    <div {...otherProps} onClick={onClick} tabIndex={0} />
  ) : (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...otherProps} onClick={onClick} />
  );
}

let linkStyles = css`
  background-color: rgba(0, 0, 0, 0);
  color: inherit;
  text-align: inherit;
  font: inherit;
  list-style: none;
  text-decoration: none;
`;

export default styled(Touchable)`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-basis: auto;
  flex-direction: column;
  flex-shrink: 0;
  margin: 0;
  min-height: 0;
  min-width: 0;
  padding: 0;
  position: relative;
  z-index: 0;
  border: 0 solid black;
  border-image: initial;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  transition-property: opacity;
  transition-duration: 0.15s;
  ${(props) => (props.href == null ? undefined : linkStyles)}
  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.9;
  }
`;
