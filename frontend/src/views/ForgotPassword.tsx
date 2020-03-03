import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useForm, FieldError } from 'react-hook-form';

import { Card, Text, View, Button, Form, TextInput } from '../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import { validateEmail } from '../utils/validation';

export default function ForgotPassword() {
  let history = useHistory();
  let { register, handleSubmit, errors } = useForm();
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };

  let onSubmit = () => {
    // TODO: Call forgot password BE
    history.push('/forgot-password-submitted');
  };

  return (
    <Container>
      <ContainerCard
        titleContainerProps={{ style: { textAlign: 'center', height: 54 } }}
        title="Recover Password"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        <Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Text>Please provide your email address to recover your password</Text>
            <TextInput
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
            <SubmitButton text="Send Recovery Email" type="submit" />
          </Form>
        </Content>
      </ContainerCard>
      <RowView>
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

const Content = styled(View)`
  padding: 24px;
  width: 100%;
`;

const SubmitButton = styled(Button)`
  margin: 15px 0 10px 0;
  width: 100%;
`;

const RowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  margin: 16px 0 0 0;
  align-items: center;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ContainerCard = styled(Card)`
  width: 400px;
  height: 300px;
`;
