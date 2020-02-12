import React from 'react';
import { useForm, FieldError } from 'react-hook-form';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, TextInput, Text, Button, Card, Form } from '../core-ui';
import { WHITE } from '../constants/colors';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import { validateEmail } from '../utils/validation';

export default function OnBoardingSignUp() {
  let history = useHistory();
  let { register, handleSubmit, errors, watch } = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (_values:any) => {
    // console.log(values, 'TEST');
  };
  let inputContainerStyle={marginTop: 12};

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
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormContent>
            <TextInput
              name="email"
              ref={register({
                required: 'Email should not be empty',
                validate: (val) => validateEmail(val) || 'Incorrect email format',
              })}
              label="Email Address"
              placeholder="Your Email Address"
              errorMessage={
                (errors?.email as FieldError)?.message || ''
              }
              containerStyle={inputContainerStyle}
            />
            <RowView>
              <View flex style={{ marginRight: 10 }}>
                <TextInput
                  name="firstName"
                  ref={register({
                    required: 'First name should not be empty',
                  })}
                  label="First Name"
                  placeholder="Your First Name"
                  errorMessage={
                    (errors?.firstName as FieldError)?.message || ''
                  }
                  containerStyle={inputContainerStyle}                />
              </View>
              <View flex style={{ marginLeft: 10 }}>
                <TextInput
                  name="lastName"
                  ref={register({
                    required: 'Last name should not be empty',
                  })}
                  label="Last Name"
                  placeholder="Your Last Name"
                  errorMessage={
                    (errors?.lastName as FieldError)?.message || ''
                  }
                  containerStyle={inputContainerStyle}
                />
              </View>
            </RowView>
            <TextInput
              name="company"
              ref={register({
                required: 'Company name should not be empty',
              })}
              label="Company"
              placeholder="Your Company"
              errorMessage={
                (errors?.company as FieldError)?.message || ''
              }
              containerStyle={inputContainerStyle}
            />
            <TextInput
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
              errorMessage={
                (errors?.password as FieldError)?.message || ''
              }
              containerStyle={inputContainerStyle}
            />
            <TextInput
              name="confirmPassword"
              ref={register({
                required: 'Confirm password should not be empty',
                validate: (val) => val === watch('password') || 'Confirm password does not match',
              })}
              label="Confirm Password"
              placeholder="Re-enter Password"
              type="password"
              errorMessage={
                (errors?.confirmPassword as FieldError)?.message || ''
              }
              containerStyle={inputContainerStyle}
            />
            <SubmitButton text="Create and Submit" type="submit" />
          </FormContent>
        </Form>
      </Card>
      <RowView style={{ marginTop: 16, alignItems: 'center' }}>
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

`;

const FormContent = styled(View)`
  background-color: ${WHITE};
  padding: 10px 50px 0 50px;
`;


const SubmitButton = styled(Button)`
  margin: 15px 0 30px 0;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
