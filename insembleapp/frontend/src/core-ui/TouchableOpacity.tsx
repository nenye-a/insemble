import React, { ComponentProps } from 'react';
import styled from 'styled-components';

type TouchableProps = ComponentProps<'a'>;

export const Container = styled('div')`
  &:hover {
    opacity: 0.7;
  }
`;

export default function Touchable(props: TouchableProps) {
  let { children, ...otherProps } = props;
  return (
    <Container>
      <a {...otherProps}>{children}</a>
    </Container>
  );
}
