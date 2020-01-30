import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { Text, Button, Card, Label, RadioGroup, TextArea, Modal } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};
export default function ContactModal(props: Props) {
  let { visible, onClose } = props;
  let [selectedSubject, setSelectedSubject] = useState('');
  let [message, setMessage] = useState('');

  return (
    <Container
      visible={visible}
      onClose={onClose}
      overlayStyle={{ zIndex: 100 }}
      svgCloseProps={{ fill: THEME_COLOR }}
    >
      <Card style={{ padding: 24 }}>
        <Title color={THEME_COLOR} fontSize={FONT_SIZE_LARGE}>
          Send a Message
        </Title>
        <Label text="Subject" />
        <RadioGroup
          selectedOption={selectedSubject}
          options={[
            `I'm very interested in this property for immediate lease`,
            `I'm interested in this property for lease in the next year`,
            `I'm interested for other reasons`,
            `Interested, but just browsing`,
          ]}
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
        <SendMessageButton text="Send Message" />
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
