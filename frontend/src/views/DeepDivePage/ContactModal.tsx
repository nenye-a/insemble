import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { Text, Button, Card, Label, RadioGroup, TextArea, Modal, Alert } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import { CREATE_CONVERSATION } from '../../graphql/queries/server/message';
import {
  CreateConversation,
  CreateConversationVariables,
} from '../../generated/CreateConversation';
import { SenderRole } from '../../generated/globalTypes';
import { useCredentials } from '../../utils';

type Props = {
  visible: boolean;
  onClose: () => void;
  brandId: string;
  matchScore?: number;
};

type Params = {
  paramsId: string;
};

export default function ContactModal(props: Props) {
  let { visible, onClose, brandId, matchScore } = props;
  let [selectedSubject, setSelectedSubject] = useState('');
  let [message, setMessage] = useState('');
  let { role } = useCredentials();
  let params = useParams<Params>();
  let [messageSent, setMessageSent] = useState(false);

  let isLandlord = role === SenderRole.LANDLORD;

  let [createConversation, { loading, error }] = useMutation<
    CreateConversation,
    CreateConversationVariables
  >(CREATE_CONVERSATION, {
    onCompleted: () => setMessageSent(true),
  });

  let errorMessage = error?.message || '';

  let onSubmit = () => {
    createConversation({
      variables: {
        brandId: isLandlord ? brandId : 'id brand', // TODO TENANT
        propertyId: isLandlord ? params.paramsId : 'property id', // TODO TENANT
        matchScore: matchScore || 0,
        header: selectedSubject,
        messageInput: {
          message,
          senderRole: isLandlord ? SenderRole.LANDLORD : SenderRole.TENANT,
        },
      },
    });
  };

  let tenantSubjectOptions = [
    `I'm very interested in this property for immediate lease`,
    `I'm interested in this property for lease in the next year`,
    `I'm interested for other reasons`,
    `Interested, but just browsing`,
  ];

  let landlordSubjectOptions = [
    `Interested in immediate lease`,
    `Interested in lease for the next year`,
    `Just browse`,
  ];

  return (
    <Container
      visible={visible}
      onClose={onClose}
      overlayStyle={{ zIndex: 100 }}
      svgCloseProps={{ fill: THEME_COLOR }}
    >
      <Card style={{ padding: 24 }}>
        {messageSent ? (
          <Alert style={{ marginBottom: 24 }} visible text="Message has been sent." />
        ) : (
          <>
            <Title color={THEME_COLOR} fontSize={FONT_SIZE_LARGE}>
              Send a Message
            </Title>
            <Alert style={{ marginBottom: 24 }} visible={!!errorMessage} text={errorMessage} />
            <Label text="Subject" />
            <RadioGroup
              selectedOption={selectedSubject}
              options={isLandlord ? landlordSubjectOptions : tenantSubjectOptions}
              onSelect={(option) => {
                setSelectedSubject(option);
              }}
              style={{ marginBottom: 24 }}
              radioItemProps={{ style: { marginTop: 8 } }}
            />
            <TextArea
              label="Message"
              values={message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setMessage(e.target.value);
              }}
              showCharacterLimit
            />
            <SendMessageButton loading={loading} text="Send Message" onPress={onSubmit} />
          </>
        )}
      </Card>
    </Container>
  );
}

const Container = styled(Modal)`
  width: 640px;
  height: 480px;
  background-color: transparent;
`;

const Title = styled(Text)`
  font-weight: ${FONT_WEIGHT_BOLD};
  margin-bottom: 24px;
`;

const SendMessageButton = styled(Button)`
  margin-top: 24px;
  align-self: flex-end;
`;
