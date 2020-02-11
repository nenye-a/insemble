import React, { useState } from 'react';
import { View, TextInput, Text, Button, Card } from '../core-ui';
import styled from 'styled-components';
import { WHITE } from '../constants/colors';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import { useHistory } from 'react-router-dom';

export default function OnBoardingSignUp() {
  let history = useHistory();
  let [email, setEmail] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setlLastName] = useState('');
  let [company, setCompany] = useState('');
  let [password, setPassword] = useState('');
  let [confirm, setConfirm] = useState('');
  return (
    <Container>
      <Card
        titleContainerProps={{
          style: { textAlign: 'center', height: 54 },
        }}
        title="Sign Up"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        <Form>
          <Input
            label={'Email Address'}
            placeholder={'Your Email Address'}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            containerStyle={{ margin: '10px 0 0 0' }}
          />
          <RowView>
            <View flex style={{ marginRight: 10 }}>
              <Input
                label={'First Name'}
                placeholder={'Your First Name'}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </View>
            <View flex style={{ marginLeft: 10 }}>
              <Input
                label={'Last Name'}
                placeholder={'Your Last Name'}
                value={lastName}
                onChange={(event) => setlLastName(event.target.value)}
              />
            </View>
          </RowView>
          <Input
            label={'Company'}
            placeholder={'Your Company'}
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
          <Input
            label={'Password'}
            placeholder={'Enter Password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            label={'Confrim Password'}
            placeholder={'Re-enter Password'}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
          <SubmitButton
            text="Create and Submit"
            onPress={() => {
              history.push('/map');
            }}
          />
        </Form>
      </Card>
      <RowView style={{ marginTop: 16 }}>
        <Text>Already have an account? </Text>
        <Button
          mode="transparent"
          text="Log in here"
          onPress={() => {
            history.push('/login');
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
`;
const Form = styled(View)`
  background-color: ${WHITE};
  padding: 10px 50px 0 50px;
`;

const Input = styled(TextInput)`
  margin: 0 0 20px 0;
`;

const SubmitButton = styled(Button)`
  margin: 15px 0 30px 0;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
