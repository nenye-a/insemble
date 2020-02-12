import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, TextInput, Button, Text, View } from '../core-ui';
import { useHistory } from 'react-router-dom';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';

export default function Login() {
  let history = useHistory();
  let [email, setEmail] = useState<string>('');
  let [password, setPassword] = useState<string>('');
  let noAccount = "Don't have an account?";
  return (
    <Container>
      <LoginCard
        titleContainerProps={{ style: { textAlign: 'center', height: 54 } }}
        title="Log In"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        <Content>
          <TextInput
            label="Title"
            placeholder="Your Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextInput
            label="Current Password"
            placeholder="Enter Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            text="Submit"
            onPress={() => {
              history.push('/map');
            }}
          />
        </Content>
      </LoginCard>
      <RowView>
        <Text>{noAccount} </Text>
        <Button
          mode="transparent"
          text="Sign Up here"
          onPress={() => {
            history.push('/signup');
          }}
        />
      </RowView>
    </Container>
  );
}

const RowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 16px 0 0 0;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoginCard = styled(Card)`
  width: 360px;
  height: 310px;
`;

const Content = styled(View)`
  flex: 1;
  justify-content: space-around;
  margin: 24px;
`;
