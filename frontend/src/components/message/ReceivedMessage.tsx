import React from 'react';
import styled from 'styled-components';

import { View, Text, Avatar } from '../../core-ui';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';
import { FONT_WEIGHT_MEDIUM } from '../../constants/theme';

type Props = {
  avatar?: string | null;
  message: string;
  header?: string;
};

export default function SentMessage({ avatar, message, header }: Props) {
  return (
    <MessageContainer flex>
      <ReplyAvatarContainer flex>
        <Avatar size="medium" image={avatar || imgPlaceholder} />
      </ReplyAvatarContainer>
      <SentMessageContainer style={{ flex: 8 }}>
        {header ? (
          <Text style={{ marginBottom: 12 }} fontWeight={FONT_WEIGHT_MEDIUM}>
            {header}
          </Text>
        ) : null}
        <Text>{message}</Text>
      </SentMessageContainer>
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

const AvatarContainer = styled(View)`
  padding: 0 24px;
`;

const ReplyAvatarContainer = styled(AvatarContainer)`
  justify-content: center;
  align-items: center;
`;

const SentMessageContainer = styled(View)`
  padding: 12px 18px 12px 0;
`;
