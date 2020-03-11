import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, Redirect } from 'react-router-dom';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';

import { Card, Text, View, Button, Form, TextInput, Alert } from '../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import { validateEmail } from '../utils/validation';
import {
  FORGOT_PASSWORD_TENANT,
  FORGOT_PASSWORD_LANDLORD,
} from '../graphql/queries/server/forgotPassword';
import {
  ForgotPasswordTenant,
  ForgotPasswordTenantVariables,
} from '../generated/ForgotPasswordTenant';
import {
  ForgotPasswordLandlord,
  ForgotPasswordLandlordVariables,
} from '../generated/ForgotPasswordLandlord';
import { Role } from '../types/types';
import { formatGraphQLError } from '../utils';

export default function ForgotPassword() {
  let history = useHistory();
  let role = history.location?.state?.role;
  let isTenant = role === Role.TENANT;
  let { register, handleSubmit, errors } = useForm();
  let [hasSubmitted, setHasSubmitted] = useState(false);
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  let [forgotPasswordTenant, { loading: tenantLoading, error: tenantError }] = useMutation<
    ForgotPasswordTenant,
    ForgotPasswordTenantVariables
  >(FORGOT_PASSWORD_TENANT, {
    onCompleted: () => setHasSubmitted(true),
  });

  let [forgotPasswordLandlord, { loading: landlordLoading, error: landlordError }] = useMutation<
    ForgotPasswordLandlord,
    ForgotPasswordLandlordVariables
  >(FORGOT_PASSWORD_LANDLORD);

  let errorMessage = tenantError?.message || landlordError?.message || '';

  let onSubmit = (data: FieldValues) => {
    let { email } = data;
    if (isTenant) {
      forgotPasswordTenant({
        variables: { email },
      });
    } else {
      forgotPasswordLandlord({
        variables: { email },
      });
    }
  };

  if (!role) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <ContainerCard
        titleContainerProps={{ style: { textAlign: 'center', height: 54 } }}
        title="Recover Password"
        titleProps={{ style: { fontSize: FONT_SIZE_MEDIUM, fontWeight: FONT_WEIGHT_NORMAL } }}
        titleBackground="purple"
      >
        <Content>
          {!hasSubmitted ? (
            <Form onSubmit={handleSubmit(onSubmit)}>
              {errorMessage && <Alert visible={true} text={formatGraphQLError(errorMessage)} />}
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
              <SubmitButton
                text="Send Recovery Email"
                type="submit"
                loading={tenantLoading || landlordLoading}
              />
            </Form>
          ) : (
            <Text>
              If we found an account associated with that username, we’ve sent password reset
              instructions to the primary email address on the account.
            </Text>
          )}
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
