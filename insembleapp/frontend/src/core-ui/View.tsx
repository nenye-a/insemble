import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';

type Props = Omit<ComponentProps<'span'>, 'ref'> & {
  flex?: boolean;
  href?: string;
  target?: string;
};

function View(props: Props) {
  let { flex, href, target, ...otherProps } = props;
  return href == null ? (
    <div {...otherProps} />
  ) : (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a href={href} target={target} {...otherProps} />
  );
}

let baseStyles = css`
  flex-basis: auto;
  flex-shrink: 0;
`;

let flexStyles = css`
  flex-basis: 0%;
  flex-grow: 1;
  flex-shrink: 1;
`;

export default styled(View)`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  ${(props) => (props.flex ? flexStyles : baseStyles)}
  margin: 0;
  min-height: 0;
  min-width: 0;
  padding: 0;
  position: relative;
  z-index: 0;
  border: 0 solid black;
  border-image: initial;
`;
