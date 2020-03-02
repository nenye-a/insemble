import React from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { TextInput, Button, View, Form, Alert } from '../core-ui';
import { validateEmail } from '../utils/validation';
import { LOGIN_TENANT, LOGIN_LANDLORD } from '../graphql/queries/server/auth';
import { LoginTenant, LoginTenantVariables } from '../generated/LoginTenant';
import { asyncStorage } from '../utils';
import { Role } from '../types/types';
import { LoginLandlord, LoginLandlordVariables } from '../generated/LoginLandlord';

type Props = {
  role: Role;
};

export default function Login(props: Props) {
  let history = useHistory();
  let { role } = props;
  let { register, handleSubmit, errors } = useForm();
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  let [tenantLogin, { data, loading, error }] = useMutation<LoginTenant, LoginTenantVariables>(
    LOGIN_TENANT
  );
  let [
    landlordLogin,
    { data: landlordData, loading: landlordLoading, error: landlordError },
  ] = useMutation<LoginLandlord, LoginLandlordVariables>(LOGIN_LANDLORD);

  let onSubmit = (data: FieldValues) => {
    let { email, password } = data;
    tenantLogin({
      variables: { email, password },
    });
  };

  let saveUserData = async (token: string, role: Role, brandId: string) => {
    await asyncStorage.saveTenantToken(token);
    await asyncStorage.saveRole(role);
    await asyncStorage.saveBrandId(brandId);
  };
  if (data) {
    let { loginTenant } = data;
    let { token, brandId } = loginTenant;
    saveUserData(token, Role.TENANT, brandId);
    history.push(`/map/${brandId}`);
  }

  //TODO: Check did landlord have property (for which page we should redirect)
  let onSubmitLandlord = (landlordData: FieldValues) => {
    let { email, password } = landlordData;
    landlordLogin({
      variables: { email, password },
    });
  };

  let saveLandlordData = async (token: string, role: Role) => {
    await asyncStorage.saveTenantToken(token);
    await asyncStorage.saveRole(role);
  };
  if (landlordData) {
    let { loginLandlord } = landlordData;
    let { token } = loginLandlord;
    saveLandlordData(token, Role.LANDLORD);
    history.push(`/landlord/properties`);
  }

  return (
    <Content>
      <Form
        onSubmit={role === Role.TENANT ? handleSubmit(onSubmit) : handleSubmit(onSubmitLandlord)}
      >
        <Alert
          visible={!!error || !!landlordError}
          text={error?.message || landlordError?.message || ''}
        />
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
          errorMessage={(errors?.password as FieldError)?.message || ''}
          containerStyle={inputContainerStyle}
        />
        <SubmitButton text="Submit" type="submit" loading={loading || landlordLoading} />
      </Form>
    </Content>
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
