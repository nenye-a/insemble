import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Text, View } from '../core-ui';
import { ALERT_BACKGROUND_COLOR } from '../constants/colors';

type Props = {
  text: string;
};

export default function TrialEndedBanner({ text }: Props) {
  let history = useHistory();
  return (
    <Container>
      <Text>{`Looks like your trial has ended, but it's easy to get back up and running`}</Text>
      <Button text={text} onPress={() => history.push('/landlord/billing')} />
    </Container>
  );
}

const Container = styled(View)`
  background-color: ${ALERT_BACKGROUND_COLOR}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  `;
