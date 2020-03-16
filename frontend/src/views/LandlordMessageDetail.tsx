import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { View, Text, Card, Avatar, Button, TextArea, LoadingIndicator } from '../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR } from '../constants/colors';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE } from '../constants/theme';
import SvgArrowBack from '../components/icons/arrow-back';
import SvgInfoFilled from '../components/icons/info-filled';
import SvgReply from '../components/icons/reply';
import { Conversation, ConversationVariables } from '../generated/Conversation';
import {
  GET_CONVERSATION,
  CREATE_CONVERSATION,
  GET_CONVERSATIONS,
} from '../graphql/queries/server/message';
import { CreateConversation, CreateConversationVariables } from '../generated/CreateConversation';
import { SenderRole } from '../generated/globalTypes';

type Params = {
  conversationId: string;
};

export default function LandlordMessageDetail() {
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
        brandId: conversation?.conversation.brand.tenantId || '',
        propertyId: conversation?.conversation.property.id || '',
        matchScore: conversation?.conversation.matchScore || 0,
        header: conversation?.conversation.header || '',
        messageInput: {
          message: reply,
          senderRole: SenderRole.LANDLORD,
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
          onPress={() => history.goBack()}
          textProps={{ style: { marginLeft: 12 } }}
        />
        <Row>
          <SvgReply />
          <SvgInfoFilled style={{ color: THEME_COLOR, marginLeft: 10 }} />
        </Row>
      </NavigationContainer>
      {!conversation && conversationLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <HeaderContainer>
            <Text color={THEME_COLOR} fontWeight={FONT_WEIGHT_BOLD} fontSize={FONT_SIZE_LARGE}>
              {conversation?.conversation.brand.name}
            </Text>
          </HeaderContainer>
          {conversation?.conversation.messages.map((item, index) => {
            let { message, sender } = item;
            return (
              <>
                {sender === SenderRole.TENANT ? (
                  <MessageContainer flex>
                    <ReplyAvatarContainer flex>
                      <Avatar size="medium" image={conversation?.conversation.tenant.avatar} />
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
                        <Avatar size="medium" image={conversation?.conversation.landlord.avatar} />
                      </AvatarContainer>
                    </RepliedMessage>
                  </MessageContainer>
                )}
              </>
            );
          })}

          <LandlordMessageContainer>
            <LandlordAvatarContainer flex>
              <Avatar size="medium" image={conversation?.conversation.landlord.avatar} />
            </LandlordAvatarContainer>
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
          </LandlordMessageContainer>
        </>
      )}
    </Card>
  );
}

const Row = styled(View)`
  flex-direction: row;
`;

const ButtonContainer = styled(View)`
  justify-content: flex-end;
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0 24px;
`;

const LandlordMessageContainer = styled(RowedView)`
  padding-right: 24px;
`;

const HeaderContainer = styled(View)`
  justify-content: space-between;
  padding: 0 24px;
`;

const NavigationContainer = styled(RowedView)`
  padding: 12px 24px 12px 12px;
  align-items: center;
`;

const AvatarContainer = styled(View)`
  padding: 0 0px;
  justify-content: center;
`;

const LandlordAvatarContainer = styled(AvatarContainer)`
  justify-content: center;
  align-items: center;
`;

const MessageContainer = styled(RowedView)`
  padding: 0 0 10px 0;
  align-items: center;
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
