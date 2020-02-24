import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { View, Text, Button, TextInput } from '../core-ui';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE } from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';
import LandlordLanding from './LandlordLanding';

export default function LandlordSignUp() {
  let history = useHistory();
  let [email, setEmail] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [company, setCompany] = useState('');
  let [password, setPassword] = useState('');
  let [confirm, setConfirm] = useState('');
  let flexNone = { flex: 'none' };
  return (
    <Container>
      <LandlordLanding />
      <Form>
        <TitleText>Sign Up</TitleText>
        <Input
          label="Email Address"
          placeholder="Your Email Address"
          containerStyle={flexNone}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <SignUpRowView>
          <View flex style={{ marginRight: 10 }}>
            <Input
              label="First Name"
              placeholder="Your First Name"
              containerStyle={flexNone}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </View>
          <View flex style={{ marginLeft: 10 }}>
            <Input
              label="Last Name"
              placeholder="Your Last Name"
              containerStyle={flexNone}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </View>
        </SignUpRowView>
        <Input
          label="Company"
          placeholder="Your Company"
          containerStyle={flexNone}
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
        <Input
          label="Password"
          placeholder="Enter Password"
          containerStyle={flexNone}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          label="Confrim Password"
          placeholder="Re-enter Password"
          containerStyle={flexNone}
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
        <SubmitButton text="Create and Submit" onSubmit={() => {}} />
        <SignUpRowView>
          <Text>Already have an account? </Text>
          <Button
            mode="transparent"
            text="Log in here"
            onPress={() => {
              history.push('/landlord/login');
            }}
          />
        </SignUpRowView>
      </Form>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const SignUpRowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Form = styled(View)`
  flex: 1;
  background-color: ${WHITE};
  padding: 10px 50px 0 50px;
`;

const Input = styled(TextInput)`
  margin: 0 0 24px 0;
`;

const SubmitButton = styled(Button)`
  margin: 15px 0 30px 0;
`;

const TitleText = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 30px 0 20px 0;
  color: ${THEME_COLOR};
`;
