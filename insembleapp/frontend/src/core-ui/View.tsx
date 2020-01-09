import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';

type Props = ComponentProps<'div'> & {
  flex?: boolean;
};

function View(props: Props) {
  let { flex, ...otherProps } = props;
  return <div {...otherProps} />;
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
