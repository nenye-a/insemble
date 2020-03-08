import React from 'react';
import styled from 'styled-components';

import { View, Text } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';

type Props = ViewProps & {
  text?: string;
};

export default function EmptyDataComponent({ text, ...otherProps }: Props) {
  return (
    <Container flex {...otherProps}>
      <Text color={THEME_COLOR}>{text ? text : 'No Data Found'} </Text>
    </Container>
  );
}

const Container = styled(View)`
  justify-content: center;
  align-items: center;
`;
