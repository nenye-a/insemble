import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import { View, Button, TextArea, Avatar } from '../../core-ui';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';

type Props = {
  avatar?: string | null;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  reply: string;
  loading: boolean;
  onReply: () => void;
};

export default function ReplyMessageBox({ avatar, onChange, reply, loading, onReply }: Props) {
  return (
    <ReplyMessageContainer>
      <ReplyAvatarContainer flex>
        <Avatar size="medium" image={avatar || imgPlaceholder} />
      </ReplyAvatarContainer>
      <View style={{ flex: 8 }}>
        <TextArea
          placeholder="Reply"
          values={reply}
          onChange={onChange}
          showCharacterLimit
          containerStyle={{ marginTop: 12, marginBottom: 12 }}
        />
        <ButtonContainer>
          <Button text="Send Reply" loading={loading} onPress={onReply} />
        </ButtonContainer>
      </View>
    </ReplyMessageContainer>
  );
}

const RowedView = styled(View)`
  flex-direction: row;
`;

const AvatarContainer = styled(View)`
  padding: 0 24px;
`;

const ReplyMessageContainer = styled(RowedView)`
  padding-right: 24px;
`;

const ReplyAvatarContainer = styled(AvatarContainer)`
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled(View)`
  justify-content: flex-end;
  flex-direction: row;
  margin-bottom: 24px;
`;
