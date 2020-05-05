import React from 'react';
import styled from 'styled-components';

import { Button, Text, View, Card } from '../core-ui';

type Props = {
  title: string;
  text: string;
  buttonText: string;
  onPress: () => void;
};

export default function UpgradeToAccess(props: Props) {
  let { text, buttonText, onPress, title } = props;
  return (
    <UpgradeModal>
      <Card title={title} titleBackground="purple">
        <UpgradeContent>
          <Text>{text}</Text>
          <Button style={{ marginTop: 12 }} text={buttonText} onPress={onPress} />
        </UpgradeContent>
      </Card>
    </UpgradeModal>
  );
}

const UpgradeContent = styled(View)`
  padding: 12px;
  align-items: center;
`;

const UpgradeModal = styled(View)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20%;
  left: 40%;
  align-content: center;
  justify-content: center;
`;
