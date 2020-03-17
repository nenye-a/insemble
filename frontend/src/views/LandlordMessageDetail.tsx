import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { View, Text, Card, Button, LoadingIndicator } from '../core-ui';
import { THEME_COLOR } from '../constants/colors';
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
import { ReceivedMessage, SentMessage, ReplyMessageBox } from '../components/message';

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
            <BrandName>{conversation?.conversation.brand.name}</BrandName>
          </HeaderContainer>
          {conversation?.conversation.messages.map((item, index) => {
            let { message, sender } = item;
            return (
              <>
                {sender === SenderRole.TENANT ? (
                  <ReceivedMessage
                    avatar={conversation?.conversation.landlord.avatar}
                    message={message}
                  />
                ) : (
                  <SentMessage
                    avatar={conversation?.conversation.tenant.avatar}
                    message={message}
                    header={index === 0 ? conversation?.conversation.header : ''}
                  />
                )}
              </>
            );
          })}

          <ReplyMessageBox
            avatar={conversation?.conversation.landlord.avatar}
            onChange={(e) => {
              setReply(e.target.value);
            }}
            reply={reply}
            loading={loading}
            onReply={onReply}
          />
        </>
      )}
    </Card>
  );
}

const Row = styled(View)`
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0 24px;
`;

const HeaderContainer = styled(View)`
  justify-content: space-between;
  padding: 18px 24px;
`;

const NavigationContainer = styled(RowedView)`
  padding: 12px 24px 12px 12px;
  align-items: center;
`;

const BrandName = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_BOLD};
`;
