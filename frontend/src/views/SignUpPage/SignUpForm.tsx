import React from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { View, TextInput, Form, Button } from '../../core-ui';
import { validateEmail } from '../../utils/validation';
import { WHITE } from '../../constants/colors';
import { REGISTER_TENANT } from '../../graphql/queries/server/auth';
import { RegisterTenant, RegisterTenantVariables } from '../../generated/server/RegisterTenant';
import { asyncStorage } from '../../utils';

enum Role {
  Tenant = 'Tenant',
  Landlord = 'Landlord',
}

type Props = {
  role: 'Tenant' | 'Landlord'; //change to constants
};

export default function SignUpForm(_props: Props) {
  let { register, handleSubmit, errors, watch } = useForm();
  let history = useHistory();
  let [registerTenant, { data, loading }] = useMutation<RegisterTenant, RegisterTenantVariables>(
    REGISTER_TENANT
  );
  let inputContainerStyle = { marginTop: 12 };

  let onSubmit = (data: FieldValues) => {
    let { email, firstName, lastName, company, password } = data;
    registerTenant({
      variables: {
        tenant: {
          email,
          firstName,
          lastName,
          company,
          password,
        },
      },
    });
  };

  let saveUserData = async (token: string, role: Role) => {
    await asyncStorage.saveTenantToken(token);
    await asyncStorage.saveRole(role);
  };

  if (data) {
    let { registerTenant } = data;
    let { token } = registerTenant;

    saveUserData(token, Role.Tenant);
    history.push('/map');
  }
  // TODO: handle if error

  return (
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
          errorMessage={(errors?.email as FieldError)?.message || ''}
          containerStyle={inputContainerStyle}
        />
        <RowedView>
          <View flex style={{ marginRight: 10 }}>
            <TextInput
              name="firstName"
              ref={register({
                required: 'First name should not be empty',
              })}
              label="First Name"
              placeholder="Your First Name"
              errorMessage={(errors?.firstName as FieldError)?.message || ''}
              containerStyle={inputContainerStyle}
            />
          </View>
          <View flex style={{ marginLeft: 10 }}>
            <TextInput
              name="lastName"
              ref={register({
                required: 'Last name should not be empty',
              })}
              label="Last Name"
              placeholder="Your Last Name"
              errorMessage={(errors?.lastName as FieldError)?.message || ''}
              containerStyle={inputContainerStyle}
            />
          </View>
        </RowedView>
        <TextInput
          name="company"
          ref={register({
            required: 'Company name should not be empty',
          })}
          label="Company"
          placeholder="Your Company"
          errorMessage={(errors?.company as FieldError)?.message || ''}
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
        <TextInput
          name="confirmPassword"
          ref={register({
            required: 'Confirm password should not be empty',
            validate: (val) => val === watch('password') || 'Confirm password does not match',
          })}
          label="Confirm Password"
          placeholder="Re-enter Password"
          type="password"
          errorMessage={(errors?.confirmPassword as FieldError)?.message || ''}
          containerStyle={inputContainerStyle}
        />
        <SubmitButton text="Create and Submit" type="submit" loading={loading} />
      </FormContent>
    </Form>
  );
}

const FormContent = styled(View)`
  background-color: ${WHITE};
  padding: 10px 50px 0 50px;
`;

const RowedView = styled(View)`
  flex-direction: row;
`;
const SubmitButton = styled(Button)`
  margin: 15px 0 30px 0;
`;
