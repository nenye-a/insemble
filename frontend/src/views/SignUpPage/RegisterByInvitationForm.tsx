import React from 'react';
import styled from 'styled-components';

import { View, TextInput, Alert, Button, Form } from '../../core-ui';
import { Role } from '../../types/types';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import {
  REGISTER_LANDLORD_INVITATION,
  REGISTER_TENANT_INVITATION,
} from '../../graphql/queries/server/auth';
import {
  RegisterLandlordInvitation,
  RegisterLandlordInvitationVariables,
} from '../../generated/RegisterLandlordInvitation';
import {
  RegisterTenantInvitation,
  RegisterTenantInvitationVariables,
} from '../../generated/RegisterTenantInvitation';
import { saveCredentials } from '../../utils';

type Params = {
  pendConvId: string;
};
type Props = {
  role: Role;
};
export default function RegisterByInvitationForm({ role }: Props) {
  let { register, handleSubmit, errors, watch } = useForm();
  let params = useParams<Params>();
  let history = useHistory();
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };

  let [
    registerLandlord,
    { data: landlordData, loading: landlordLoading, error: landlordError },
  ] = useMutation<RegisterLandlordInvitation, RegisterLandlordInvitationVariables>(
    REGISTER_LANDLORD_INVITATION
  );

  let [
    registerTenant,
    { data: tenantData, loading: tenantLoading, error: tenantError },
  ] = useMutation<RegisterTenantInvitation, RegisterTenantInvitationVariables>(
    REGISTER_TENANT_INVITATION
  );

  let onSubmit = (data: FieldValues) => {
    let { password } = data;
    if (role === Role.TENANT) {
      registerTenant({
        variables: {
          password,
          invitationCode: params.pendConvId,
        },
      });
    } else {
      registerLandlord({
        variables: {
          password,
          invitationCode: params.pendConvId,
        },
      });
    }
  };

  if (tenantData) {
    let { registerTenantInvitation } = tenantData;
    let { token, brandId } = registerTenantInvitation;
    saveCredentials({
      tenantToken: token,
      role: Role.TENANT,
    });

    if (brandId) {
      history.push(`/map/${brandId}`);
    } else {
      history.push('/user/brands');
    }
  }

  if (landlordData) {
    let { registerLandlordInvitation } = landlordData;
    let { token } = registerLandlordInvitation;
    saveCredentials({
      landlordToken: token,
      role: Role.LANDLORD,
    });

    return <Redirect to={{ pathname: `/landlord/properties/`, state: { signedIn: true } }} />;
  }

  let errorMessage = landlordError?.message || tenantError?.message || '';

  return (
    <Content>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage ? (
          <Alert visible={true} text={errorMessage} />
        ) : (
          <>
            <TextInput
              label="Password"
              placeholder="Enter Your Password"
              type="password"
              name="password"
              containerStyle={inputContainerStyle}
              ref={register({
                required: watch('currentPassword') ? 'New password should not be empty' : false,
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              errorMessage={(errors?.password as FieldError)?.message || ''}
            />
            <TextInput
              label="Confirm Password"
              placeholder="Re-Enter Your Password"
              type="password"
              containerStyle={inputContainerStyle}
              name="confirmPassword"
              ref={register({
                required: watch('password') ? 'Confirm password should not be empty' : false,
                ...(watch('password') && {
                  validate: (val) => val === watch('password') || 'Confirm password does not match',
                }),
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              errorMessage={(errors?.confirmPassword as FieldError)?.message || ''}
            />
            <SubmitButton
              loading={landlordLoading || tenantLoading}
              text="Register"
              type="submit"
            />
          </>
        )}
      </Form>
    </Content>
  );
}

const SubmitButton = styled(Button)`
  margin: 15px 0 10px 0;
  width: 100%;
`;

const Content = styled(View)`
  padding: 24px;
  width: 100%;
`;
