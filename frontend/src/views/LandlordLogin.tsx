import React from 'react';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';

import LandingBackground from '../assets/images/landlord-background.png';
import { validateEmail } from '../utils/validation';
import { View, Text, Button, TextInput, Form, Alert } from '../core-ui';
import { LOGIN_LANDLORD } from '../graphql/queries/server/auth';
import {
  FONT_SIZE_XXLARGE,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_LIGHT,
} from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';
import { Role } from '../types/types';
import { asyncStorage } from '../utils';
import { LoginLandlord, LoginLandlordVariables } from '../generated/LoginLandlord';

export default function LandlordSignUp() {
  //TODO: Check did landlord have property (for which page we should redirect)
  let history = useHistory();
  let { register, errors, handleSubmit } = useForm();
  let noAccount = "Don't have an account?";
  let [landlordLogin, { data, loading, error }] = useMutation<
    LoginLandlord,
    LoginLandlordVariables
  >(LOGIN_LANDLORD);
  let onSubmit = (data: FieldValues) => {
    let { email, password } = data;
    landlordLogin({
      variables: { email, password },
    });
  };
  let saveUserData = async (token: string, role: Role) => {
    await asyncStorage.saveLandlordToken(token);
    await asyncStorage.saveRole(role);
  };
  if (data) {
    let { loginLandlord } = data;
    let { token } = loginLandlord;
    saveUserData(token, Role.LANDLORD);
    history.push(`/landlord/properties`);
  }
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };

  return (
    <Container flex>
      <Description>
        <View>
          <DescriptionLargeText>Find the perfect tenant for your property</DescriptionLargeText>
          <DescriptionSmallText>
            Insemble is the world’s first smart listing service. We connect clients to the best
            tenants for your property. We match clients using customer fit & space compatibility,
            saving time for brokers, owners, and retailers.
          </DescriptionSmallText>
        </View>
      </Description>
      <FormContainer>
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <Content>
            <Alert visible={!!error} text={error?.message || ''} />

            <TitleText>Log In</TitleText>
            <Input
              name="email"
              ref={register({
                required: 'Email should not be empty',
                validate: (val) => validateEmail(val) || 'Incorrect email format',
              })}
              label="Email Address"
              placeholder="Your Email Address"
              errorMessage={(errors?.email as FieldError)?.message || ''}
              containerStyle={inputContainerStyle}
            />
            <Input
              name="password"
              ref={register({
                required: 'Password should not be empty',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              label="Password"
              placeholder="Enter Password"
              type="password"
              errorMessage={(errors?.password as FieldError)?.message || ''}
              containerStyle={inputContainerStyle}
            />
            <Button text="Submit" type="submit" loading={loading} />
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
        </LoginForm>
      </FormContainer>
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  height: 100vh;
`;

const FormContainer = styled(View)`
  flex: 1;
  background-color: ${WHITE};
  justify-content: center;
  align-items: center;
  padding: 0 40px 0 40px;
`;

const Description = styled(View)`
  flex: 3;
  justify-content: center;
  align-items: center;
  background-image: url(${LandingBackground});
`;
const Input = styled(TextInput)`
  width: 100%;
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

const RowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 24px 0 0 0;
`;

const Content = styled(View)`
  width: 100%;
  justify-content: center;
`;
const LoginForm = styled(Form)`
  width: 100%;
`;
