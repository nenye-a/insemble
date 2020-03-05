import React from 'react';
import styled from 'styled-components';

import { View, Text } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';

type Props = {
  text?: string;
};

export default function EmptyDataComponent({ text }: Props) {
  return (
    <Container flex>
      <Text color={THEME_COLOR}>{text ? text : 'No Data Found'} </Text>
    </Container>
  );
}

const Container = styled(View)`
  justify-content: center;
  align-items: center;
`;
