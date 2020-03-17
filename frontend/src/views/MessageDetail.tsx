import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router-dom';

import { View, Text, Card, Button, LoadingIndicator } from '../core-ui';
import { THEME_COLOR } from '../constants/colors';
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
import { ReplyMessageBox, ReceivedMessage, SentMessage } from '../components/message';

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
            <Address>{conversation?.conversation.property.location.address}</Address>
            <MatchScore>{conversation?.conversation.matchScore}% Match</MatchScore>
          </HeaderContainer>
          {conversation?.conversation.messages.map((item, index) => {
            let { message, sender } = item;
            return (
              <>
                {sender === SenderRole.TENANT ? (
                  <SentMessage
                    avatar={conversation?.conversation.tenant.avatar}
                    message={message}
                    header={index === 0 ? conversation?.conversation.header : ''}
                  />
                ) : (
                  <ReceivedMessage
                    avatar={conversation?.conversation.landlord.avatar}
                    message={message}
                  />
                )}
              </>
            );
          })}

          <ReplyMessageBox
            avatar={conversation?.conversation.tenant.avatar}
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

const RowedView = styled(View)`
  flex-direction: row;
`;

const HeaderContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 18px 24px;
`;

const NavigationContainer = styled(RowedView)`
  padding: 12px 24px 12px 12px;
  align-items: center;
  justify-content: space-between;
`;

const Image = styled.img`
  height: 160px;
  object-fit: cover;
`;

const HeaderText = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  color: ${THEME_COLOR};
`;
const Address = styled(HeaderText)`
  font-weight: ${FONT_WEIGHT_BOLD};
`;

const MatchScore = styled(HeaderText)`
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;
