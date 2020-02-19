import React from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { TextInput, Button, View, Form } from '../core-ui';
import { validateEmail } from '../utils/validation';
import { LOGIN_TENANT } from '../graphql/queries/server/auth';
import { LoginTenant, LoginTenantVariables } from '../generated/LoginTenant';
import { asyncStorage } from '../utils';

enum Role {
  Tenant = 'Tenant',
  Landlord = 'Landlord',
}

type Props = {
  role: 'Tenant' | 'Landlord'; //change to constants
};

export default function Login(_props: Props) {
  let history = useHistory();
  let { register, handleSubmit, errors } = useForm();
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  let [tenantLogin, { data, loading }] = useMutation<LoginTenant, LoginTenantVariables>(
    LOGIN_TENANT
  );

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
    saveUserData(token, Role.Tenant, brandId);
    history.push('/map');
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Content>
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
        <SubmitButton text="Submit" type="submit" loading={loading} />
      </Content>
    </Form>
  );
}

const Content = styled(View)`
  flex: 1;
  justify-content: space-around;
  margin: 24px;
`;
const SubmitButton = styled(Button)`
  margin: 15px 0 10px 0;
`;
