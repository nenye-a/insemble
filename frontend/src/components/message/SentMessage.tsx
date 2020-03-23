import React from 'react';
import styled from 'styled-components';

import { View, Text, Avatar } from '../../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR } from '../../constants/colors';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';

type Props = {
  avatar?: string | null;
  message: string;
};

export default function ReceivedMessage({ avatar, message }: Props) {
  return (
    <MessageContainer>
      <ReplyAvatarContainer flex />
      <ReceivedMessageContainer style={{ flex: 8 }}>
        <Text>{message}</Text>
        <AvatarContainer>
          <Avatar size="medium" image={avatar || imgPlaceholder} />
        </AvatarContainer>
      </ReceivedMessageContainer>
    </MessageContainer>
  );
}

const RowedView = styled(View)`
  flex-direction: row;
`;

const MessageContainer = styled(RowedView)`
  padding: 0 0 10px 0;
  align-items: center;
`;

const ReceivedMessageContainer = styled(View)`
  padding: 16px 18px;
  border-left: ${THEME_COLOR} 2px solid;
  background-color: ${BACKGROUND_COLOR};
  margin: 12px 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AvatarContainer = styled(View)`
  padding: 0 24px;
`;

const ReplyAvatarContainer = styled(AvatarContainer)`
  justify-content: center;
  align-items: center;
`;
