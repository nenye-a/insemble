import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { Text, View, Button, Form, TextInput, LoadingIndicator, Alert } from '../../core-ui';
import { Role } from '../../types/types';
import {
  VERIFY_RESET_PASSWORD_TENANT,
  VERIFY_RESET_PASSWORD_LANDLORD,
  RESET_PASSWORD_TENANT,
  RESET_PASSWORD_LANDLORD,
} from '../../graphql/queries/server/forgotPassword';

import {
  VerifyResetPasswordTenant,
  VerifyResetPasswordTenantVariables,
} from '../generated/VerifyResetPasswordTenant';
import {
  VerifyResetPasswordLandlord,
  VerifyResetPasswordLandlordVariables,
} from '../generated/VerifyResetPasswordLandlord';
import {
  ResetPasswordTenant,
  ResetPasswordTenantVariables,
} from '../generated/ResetPasswordTenant';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import {
  ResetPasswordLandlord,
  ResetPasswordLandlordVariables,
} from '../generated/ResetPasswordLandlord';

type Props = {
  role: Role;
};

type Params = {
  verificationId: string;
};

export default function ResetPasswordForm({ role }: Props) {
  let history = useHistory();
  let params = useParams<Params>();
  let isTenant = role === Role.TENANT;
  let { register, handleSubmit, errors, watch } = useForm();
  let [passwordSubmitted, setPasswordSubmitted] = useState(false);
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  let [newCode, setNewCode] = useState('');

  let [resetTenant, { loading: resetTenantLoading, error: resetTenantError }] = useMutation<
    ResetPasswordTenant,
    ResetPasswordTenantVariables
  >(RESET_PASSWORD_TENANT, {
    onCompleted: (result: ResetPasswordTenant) => {
      if (result.resetPasswordTenant.message === 'success') {
        setPasswordSubmitted(true);
      }
    },
  });

  let [resetLandlord, { loading: resetLandlordLoading, error: resetLandlordError }] = useMutation<
    ResetPasswordLandlord,
    ResetPasswordLandlordVariables
  >(RESET_PASSWORD_LANDLORD, {
    onCompleted: (result: ResetPasswordLandlord) => {
      if (result.resetPasswordLandlord.message === 'success') {
        setPasswordSubmitted(true);
      }
    },
  });

  let [verifyTenant, { loading: tenantLoading, error: tenantError }] = useLazyQuery<
    VerifyResetPasswordTenant,
    VerifyResetPasswordTenantVariables
  >(VERIFY_RESET_PASSWORD_TENANT, {
    variables: {
      verificationCode: params.verificationId,
    },
    onCompleted: (result: VerifyResetPasswordTenant) => {
      if (result.resetPasswordTenantVerification.message === 'success') {
        setNewCode(result.resetPasswordTenantVerification.verificationId);
      }
    },
  });

  let [verifyLandlord, { loading: landlordLoading, error: landlordError }] = useLazyQuery<
    VerifyResetPasswordLandlord,
    VerifyResetPasswordLandlordVariables
  >(VERIFY_RESET_PASSWORD_LANDLORD, {
    variables: {
      verificationCode: params.verificationId,
    },
    onCompleted: (result: VerifyResetPasswordLandlord) => {
      if (result.resetPasswordLandlordVerification.message === 'success') {
        setNewCode(result.resetPasswordLandlordVerification.verificationId);
      }
    },
  });

  let onSubmit = (data: FieldValues) => {
    let { newPassword } = data;
    if (isTenant) {
      resetTenant({
        variables: {
          password: newPassword,
          verificationCode: newCode,
        },
      });
    } else {
      resetLandlord({
        variables: {
          password: newPassword,
          verificationCode: newCode,
        },
      });
    }
  };

  let errorMessage =
    tenantError?.message ||
    landlordError?.message ||
    resetTenantError?.message ||
    resetLandlordError?.message ||
    '';

  let redirectLogin = () => {
    if (isTenant) {
      history.push('/login');
    } else {
      history.push('/landlord/login');
    }
  };

  useEffect(() => {
    if (isTenant) {
      verifyTenant();
    } else {
      verifyLandlord();
    }
  }, [isTenant, verifyLandlord, verifyTenant]);

  if (tenantLoading || landlordLoading) {
    return <LoadingIndicator />;
  }
  return (
    <>
      {!passwordSubmitted ? (
        <Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {errorMessage ? (
              <Alert visible={true} text={errorMessage} />
            ) : (
              <>
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
                <SubmitButton
                  loading={resetLandlordLoading || resetTenantLoading}
                  text="Reset Password"
                  type="submit"
                />
              </>
            )}
          </Form>
        </Content>
      ) : (
        <>
          <Content>
            <Text>
              You have successfully reset your password. You can now log in with your new password.
            </Text>
          </Content>
          <OnboardingFooter>
            <Button text="Log In" onPress={redirectLogin} />
          </OnboardingFooter>
        </>
      )}
    </>
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
