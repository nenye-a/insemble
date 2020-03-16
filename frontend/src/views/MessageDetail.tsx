import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router-dom';

import { View, Text, Card, Avatar, Button, TextArea, LoadingIndicator } from '../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR } from '../constants/colors';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE, FONT_WEIGHT_MEDIUM } from '../constants/theme';
import imgPlaceholder from '../assets/images/image-placeholder.jpg';
import SvgArrowBack from '../components/icons/arrow-back';
import SvgInfoFilled from '../components/icons/info-filled';
import { SenderRole } from '../generated/globalTypes';
import { CreateConversation, CreateConversationVariables } from '../generated/CreateConversation';
import {
  CREATE_CONVERSATION,
  GET_CONVERSATION,
  GET_CONVERSATIONS,
} from '../graphql/queries/server/message';
import { Conversation, ConversationVariables } from '../generated/Conversation';

type Params = {
  conversationId: string;
};

export default function MessageDetail() {
  let history = useHistory();
  let [reply, setReply] = useState('');
  let params = useParams<Params>();

  let { data: conversation, loading: conversationLoading } = useQuery<
    Conversation,
    ConversationVariables
  >(GET_CONVERSATION, {
    variables: {
      conversationId: params.conversationId,
    },
  });

  let [createConversation, { loading }] = useMutation<
    CreateConversation,
    CreateConversationVariables
  >(CREATE_CONVERSATION, {
    refetchQueries: [
      { query: GET_CONVERSATION, variables: { conversationId: conversation?.conversation.id } },
      { query: GET_CONVERSATIONS },
    ],
  });

  let onReply = () => {
    createConversation({
      variables: {
        brandId: conversation?.conversation.brand.id || '',
        propertyId: conversation?.conversation.property.propertyId || '',
        matchScore: conversation?.conversation.matchScore || 0,
        header: conversation?.conversation.header || '',
        messageInput: {
          message: reply,
          senderRole: SenderRole.TENANT,
        },
      },
    });
    setReply('');
  };

  return (
    <Card flex>
      <NavigationContainer>
        <Button
          mode="transparent"
          text="Back to Messages"
          icon={<SvgArrowBack style={{ color: THEME_COLOR }} />}
          onPress={() => history.push('/user/messages')}
          textProps={{ style: { marginLeft: 12 } }}
        />
        <SvgInfoFilled style={{ color: THEME_COLOR }} />
      </NavigationContainer>
      {!conversation && conversationLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Image src={conversation?.conversation.property.space[0].mainPhoto || imgPlaceholder} />
          <HeaderContainer>
            <Text color={THEME_COLOR} fontWeight={FONT_WEIGHT_BOLD} fontSize={FONT_SIZE_LARGE}>
              {conversation?.conversation.property.location.address}
            </Text>
            <Text color={THEME_COLOR} fontWeight={FONT_WEIGHT_MEDIUM} fontSize={FONT_SIZE_LARGE}>
              {conversation?.conversation.matchScore}% Match
            </Text>
          </HeaderContainer>
          {conversation?.conversation.messages.map((item) => {
            let { message, sender } = item;
            return (
              <>
                {sender === SenderRole.TENANT ? (
                  <MessageContainer flex>
                    <ReplyAvatarContainer flex>
                      <Avatar
                        size="medium"
                        image={conversation?.conversation.tenant.avatar || imgPlaceholder}
                      />
                    </ReplyAvatarContainer>
                    <TenantMessageContainer style={{ flex: 8 }}>
                      <Text>{message}</Text>
                    </TenantMessageContainer>
                  </MessageContainer>
                ) : (
                  <MessageContainer>
                    <ReplyAvatarContainer flex />
                    <RepliedMessage style={{ flex: 8 }}>
                      <Text>{message}</Text>
                      <AvatarContainer>
                        <Avatar
                          size="medium"
                          image={conversation?.conversation.landlord.avatar || imgPlaceholder}
                        />
                      </AvatarContainer>
                    </RepliedMessage>
                  </MessageContainer>
                )}
              </>
            );
          })}

          <ReplyMessageContainer>
            <ReplyAvatarContainer flex>
              <Avatar
                size="medium"
                image={conversation?.conversation.tenant.avatar || imgPlaceholder}
              />
            </ReplyAvatarContainer>
            <View style={{ flex: 8 }}>
              <TextArea
                placeholder="Reply"
                values={reply}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setReply(e.target.value);
                }}
                showCharacterLimit
                containerStyle={{ marginTop: 12, marginBottom: 12 }}
              />
              <ButtonContainer>
                <Button text="Send Reply" loading={loading} onPress={onReply} />
              </ButtonContainer>
            </View>
          </ReplyMessageContainer>
        </>
      )}
    </Card>
  );
}

const ButtonContainer = styled(View)`
  justify-content: flex-end;
  flex-direction: row;
  margin-bottom: 24px;
`;
const RowedView = styled(View)`
  flex-direction: row;
`;

const HeaderContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 24px;
`;

const NavigationContainer = styled(RowedView)`
  padding: 12px 24px 12px 12px;
  align-items: center;
  justify-content: space-between;
`;

const MessageContainer = styled(RowedView)`
  padding: 0 0 10px 0;
  align-items: center;
`;

const ReplyMessageContainer = styled(RowedView)`
  padding-right: 24px;
`;

const Image = styled.img`
  height: 160px;
  object-fit: cover;
`;

const AvatarContainer = styled(View)`
  padding: 0 24px;
`;

const ReplyAvatarContainer = styled(AvatarContainer)`
  justify-content: center;
  align-items: center;
`;

const RepliedMessage = styled(View)`
  padding: 16px 18px;
  border-left: ${THEME_COLOR} 2px solid;
  background-color: ${BACKGROUND_COLOR};
  margin-top: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TenantMessageContainer = styled(View)`
  padding: 16px 0;
`;
