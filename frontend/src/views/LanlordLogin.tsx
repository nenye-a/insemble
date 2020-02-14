import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import LandingBackground from '../components/common/LandingBackground';
import { View, Text, Button, TextInput } from '../core-ui';
import {
  FONT_SIZE_XXLARGE,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_LIGHT,
} from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';

export default function LandlordSignUp() {
  let history = useHistory();
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let noAccount = "Don't have an account?";
  let flexNone = { flex: 'none' };
  return (
    <Container>
      <Description>
        <LandingBackground />
        <TextWrapper>
          <DescriptionLargeText>Find the perfect tenant for your property</DescriptionLargeText>
          <DescriptionSmallText>
            Insemble is the world’s first smart listing service. We connect clients to the best
            tenants for your property. We match clients using customer fit & space compatibility,
            saving time for brokers, owners, and retailers.
          </DescriptionSmallText>
        </TextWrapper>
      </Description>
      <Form>
        <Content>
          <TitleText>Log In</TitleText>
          <Input
            label="Email Address"
            placeholder="Your Email Address"
            value={email}
            containerStyle={flexNone}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Password"
            placeholder="Enter Password"
            containerStyle={flexNone}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button text="Submit" onPress={() => {}} />
          <RowView>
            <Text>{noAccount} </Text>
            <Button
              mode="transparent"
              text="Sign Up here"
              onPress={() => {
                history.push('/landlord/signup');
              }}
            />
          </RowView>
        </Content>
      </Form>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const Form = styled(View)`
  flex: 1;
  background-color: ${WHITE};
  justify-content: center;
  align-items: center;
  padding: 0 40px 0 40px;
`;

const Description = styled(View)`
  flex: 3;
`;
const Input = styled(TextInput)`
  width: 300px;
  margin: 0 0 30px 0;
`;

const DescriptionLargeText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_XXLARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  width: 340px;
  margin: 0 0 24px 0;
`;
const DescriptionSmallText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_LIGHT};
  width: 560px;
`;
const TitleText = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 30px 0 20px 0;
  color: ${THEME_COLOR};
`;
const TextWrapper = styled(View)`
  position: absolute;
  top: 250px;
  left: 120px;
`;

const RowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 24px 0 0 0;
`;

const Content = styled(View)`
  flex: 1;
  margin: 24px;
  justify-content: center;
`;
