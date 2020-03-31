import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { Card, Text, LoadingIndicator } from '../core-ui';
import MessageCard from './ProfilePage/MessageCard';
import { THEME_COLOR } from '../constants/colors';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE } from '../constants/theme';
import { useCredentials } from '../utils';
import { Role } from '../types/types';
import { GET_CONVERSATIONS } from '../graphql/queries/server/message';
import { Conversations } from '../generated/Conversations';

export default function Messages() {
  let history = useHistory();
  let { role } = useCredentials();

  let { data, loading } = useQuery<Conversations>(GET_CONVERSATIONS);

  return (
    <Container flex>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Title>{role === Role.TENANT ? 'Messages' : 'Messages from Tenants'}</Title>
          {data &&
            data.conversations.map((item, index) => (
              <MessageCard
                key={index}
                isEven={(index + 1) % 2 === 0}
                conversation={item}
                onPress={() => {
                  role === Role.TENANT
                    ? history.push('/user/messages/' + item.id)
                    : history.push('/landlord/messages/' + item.id);
                }}
              />
            ))}
        </>
      )}
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
  padding: 12px 24px;
`;
