import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Button, Text, View, Card, Modal } from '../core-ui';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';

type Props = {
  visible?: boolean;
  onClose?: () => void;
  modal?: boolean;
};

export default function UpgradeToAccess(props: Props) {
  let { visible = true, onClose, modal } = props;
  let history = useHistory();
  let content = (
    <Card title="Upgrade to Access" titleBackground="purple">
      <UpgradeContent>
        <Text>{`Looks like your trial has ended, but it's easy to get back up and running.`}</Text>
        <Button
          style={{ marginTop: 12 }}
          text="Upgrade to Add"
          onPress={() => history.push('/user/plan')}
        />
      </UpgradeContent>
    </Card>
  );

  if (modal) {
    return (
      <UpgradeModal visible={visible} onClose={onClose} hideCloseButton={true}>
        {content}
      </UpgradeModal>
    );
  }
  return <Container>{content}</Container>;
}

const UpgradeContent = styled(View)`
  padding: 12px;
  align-items: center;
`;

const Container = styled(View)`
  width: 440px;
  justify-content: center;
  align-self: center;
  top: 0;
  bottom: 0;
  position: absolute;
`;

const UpgradeModal = styled(Modal)`
  width: 440px;
  height: fit-content;
  border-radius: ${DEFAULT_BORDER_RADIUS};
`;
