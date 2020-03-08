import React from 'react';
import styled from 'styled-components';
import { Modal, Card, View, Text, Button } from '../core-ui';
import { BACKGROUND_COLOR } from '../constants/colors';

type PopupButton = {
  text: string;
  onPress: () => void;
};

type Props = {
  visible?: boolean;
  title: string;
  bodyText: string;
  buttons?: Array<PopupButton>;
  onClose?: () => void;
};

export default function Popup(props: Props) {
  let { visible, title, bodyText, buttons } = props;

  return (
    <Container visible={visible || false} iconContainerStyle={{ top: 10, right: 10 }}>
      <Card title={title} titleBackground="purple">
        <Content>
          <Text>{bodyText}</Text>
        </Content>
        <Footer>
          {buttons?.reverse().map(({ text, onPress }, index) => {
            let lastIndex = buttons?.length === index + 1;
            return (
              <Button
                key={index}
                mode={lastIndex ? 'primary' : 'secondary'}
                text={text}
                onPress={onPress}
                style={!lastIndex ? { marginRight: 8 } : undefined}
              />
            );
          })}
        </Footer>
      </Card>
    </Container>
  );
}

const Container = styled(Modal)`
  width: 300px;
  height: fit-content;
  background-color: transparent;
`;

const Content = styled(View)`
  padding: 12px;
  align-items: center;
`;

const Footer = styled(View)`
  padding: 8px 12px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: ${BACKGROUND_COLOR};
`;
