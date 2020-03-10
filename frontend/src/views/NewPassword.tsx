import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, FieldError } from 'react-hook-form';

import { Card, Text, View, Button, Form, TextInput } from '../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import OnboardingFooter from '../components/layout/OnboardingFooter';
import { useHistory } from 'react-router-dom';

export default function NewPassword() {
  let history = useHistory();
  let { register, handleSubmit, errors, watch } = useForm();
  let [passwordSubmitted, setPasswordSubmitted] = useState(false);
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };

  let onSubmit = () => {
    // TODO: Call reset password BE
    setPasswordSubmitted(true);
  };

  return (
    <Container>
      <ContainerCard
        titleContainerProps={{ style: { textAlign: 'center', height: 54 } }}
        title="New Password"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        {!passwordSubmitted ? (
          <Content>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Text>Please enter your new password</Text>
              <TextInput
                label="New Password"
                placeholder="Enter Your New Password"
                type="password"
                name="newPassword"
                containerStyle={inputContainerStyle}
                ref={register({
                  required: watch('currentPassword') ? 'New password should not be empty' : false,
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                errorMessage={(errors?.newPassword as FieldError)?.message || ''}
              />
              <TextInput
                label="Confirm New Password"
                placeholder="Re-Enter Your New Password"
                type="password"
                containerStyle={inputContainerStyle}
                name="confirmNewPassword"
                ref={register({
                  required: watch('newPassword') ? 'Confirm password should not be empty' : false,
                  ...(watch('newPassword') && {
                    validate: (val) =>
                      val === watch('newPassword') || 'Confirm password does not match',
                  }),
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                errorMessage={(errors?.confirmNewPassword as FieldError)?.message || ''}
              />
              <SubmitButton text="Submit New Password" type="submit" />
            </Form>
          </Content>
        ) : (
          <>
            <Content>
              <Text>
                You have successfully reset your password. You can now log in with your new
                password.
              </Text>
            </Content>
            <OnboardingFooter>
              <Button text="Log In" type="submit" onPress={() => history.push('/login')} />
            </OnboardingFooter>
          </>
        )}
      </ContainerCard>
    </Container>
  );
}

const Content = styled(View)`
  padding: 24px;
  width: 100%;
`;

const SubmitButton = styled(Button)`
  margin: 15px 0 10px 0;
  width: 100%;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ContainerCard = styled(Card)`
  width: 400px;
  height: fit-content;
`;
