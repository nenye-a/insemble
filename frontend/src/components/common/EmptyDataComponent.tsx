import React from 'react';
import styled from 'styled-components';

import { View, Text } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';

export default function EmptyDataComponent() {
  return (
    <Container flex>
      <Text color={THEME_COLOR}>No Data Found</Text>
    </Container>
  );
}

const Container = styled(View)`
  justify-content: center;
  align-items: center;
`;
