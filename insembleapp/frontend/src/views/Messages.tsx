import React from 'react';
import styled from 'styled-components';

import { Card, Text } from '../core-ui';
import MessageCard from './ProfilePage/MessageCard';
import { THEME_COLOR } from '../constants/colors';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE } from '../constants/theme';
import { MESSAGE_LIST } from '../fixtures/dummyData';

export default function Messages() {
  return (
    <Container flex>
      <Title>Messages</Title>
      {MESSAGE_LIST.map((item, index) => (
        <MessageCard key={index} isEven={(index + 1) % 2 === 0} {...item} />
      ))}
    </Container>
  );
}

const Container = styled(Card)`
  padding: 12px 0;
`;

const Title = styled(Text)`
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_BOLD};
  font-size: ${FONT_SIZE_LARGE};
  padding: 0 24px;
`;
