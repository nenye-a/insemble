import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import View from './View';

type PressHandler = () => void;

type Props = Omit<ComponentProps<typeof View>, 'onClick'> & {
  onPress?: PressHandler;
};

function Touchable(props: Props) {
  let { onPress, href, ...otherProps } = props;
  let isLink = href != null;
  let isLocalLink = isLink && isLocalURL(href);
  return (
    <View
      href={href}
      target={isLink && !isLocalLink ? '_blank' : undefined}
      {...otherProps}
      onClick={(event) => {
        if (isLocalLink && !(event.metaKey || event.ctrlKey)) {
          event.preventDefault();
        }
        if (onPress) {
          onPress();
        }
      }}
      tabIndex={0}
    />
  );
}

// TODO: Should we move these to View?
let linkStyles = css`
  background-color: rgba(0, 0, 0, 0);
  color: inherit;
  text-align: inherit;
  font: inherit;
  list-style: none;
  text-decoration: none;
`;

export default styled(Touchable)`
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  transition-property: opacity;
  transition-duration: 0.15s;
  ${(props) => (props.href == null ? undefined : linkStyles)}
  &:active {
    opacity: 0.5;
  }
`;

function isLocalURL(link: string) {
  let firstChar = link.charAt(0);
  // TODO: Better implementation of this?
  return firstChar === '.' || firstChar === '/';
}
