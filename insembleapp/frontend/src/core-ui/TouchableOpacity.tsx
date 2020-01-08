import React, { ComponentProps } from 'react';
import styled from 'styled-components';

type TouchableOpacityProps = ComponentProps<'a'>;

export const Container = styled('div')`
  &:hover {
    opacity: 0.9;
  }
`;

export default function TouchableOpacity(props: TouchableOpacityProps) {
  let { children, ...otherProps } = props;
  return (
    <Container>
      <a {...otherProps}>{children}</a>
    </Container>
  );
}
