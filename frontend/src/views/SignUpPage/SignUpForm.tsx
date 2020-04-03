import React from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import { View, TextInput, Form, Button, Alert } from '../../core-ui';
import { validateEmail } from '../../utils/validation';
import { WHITE } from '../../constants/colors';
import { REGISTER_TENANT, REGISTER_LANDLORD } from '../../graphql/queries/server/auth';
import { RegisterTenant, RegisterTenantVariables } from '../../generated/RegisterTenant';
import { Role } from '../../types/types';
import { formatGraphQLError, getBusinessAndFilterParams } from '../../utils';
import {
  GET_TENANT_ONBOARDING_STATE,
  UPDATE_TENANT_ONBOARDING,
} from '../../graphql/queries/client/tenantOnboarding';
import { TenantOnboardingState, initialTenantOnboardingState } from '../../graphql/localState';

type Props = {
  role: Role;
};

export default function SignUpForm(props: Props) {
  let { role } = props;
  let { register, handleSubmit, errors, watch } = useForm();
  let { data: onboardingStateData, loading: onboardingStateLoading } = useQuery<
    TenantOnboardingState
  >(GET_TENANT_ONBOARDING_STATE);

  let [registerTenant, { data, loading, error }] = useMutation<
    RegisterTenant,
    RegisterTenantVariables
  >(REGISTER_TENANT);
  let [
    registerLandlord,
    { data: registerLandlordData, loading: registerLandlordLoading, error: registerLandlordError },
  ] = useMutation(REGISTER_LANDLORD);
  let [updateTenantOnboarding] = useMutation(UPDATE_TENANT_ONBOARDING);

  let errorMessage = error?.message || registerLandlordError?.message || '';

  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };

  let submitRegisterLandlord = (data: FieldValues) => {
    let { email, firstName, lastName, company, password } = data;
    registerLandlord({
      variables: {
        landlord: {
          email,
          firstName,
          lastName,
          company,
          password,
        },
      },
    });
  };

  let submitRegisterTenant = (data: FieldValues) => {
    let { email, firstName, lastName, company, password } = data;
    if (onboardingStateData && onboardingStateData.tenantOnboardingState.pendingData) {
      // TODO: check if has pending data
      let {
        confirmBusinessDetail,
        tenantGoals,
        targetCustomers,
        physicalSiteCriteria,
      } = onboardingStateData.tenantOnboardingState;
      let businessAndFilterParams = getBusinessAndFilterParams(
        confirmBusinessDetail,
        tenantGoals,
        targetCustomers,
        physicalSiteCriteria
      );
      registerTenant({
        variables: {
          tenant: {
            email,
            firstName,
            lastName,
            company,
            password,
          },
          ...businessAndFilterParams,
        },
      });
    } else {
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
    }
  };

  let onSubmit = (data: FieldValues) => {
    if (Object.keys(errors).length === 0) {
      if (role === Role.LANDLORD) {
        submitRegisterLandlord(data);
      } else {
        submitRegisterTenant(data);
      }
    }
  };

  if (data) {
    if (data.registerTenant.message === 'success') {
      updateTenantOnboarding({
        variables: {
          ...initialTenantOnboardingState,
        },
      });
      return <Redirect to={`/email-verification/${data.registerTenant.verificationId}`} />;
    }
  } else if (registerLandlordData) {
    if (registerLandlordData.registerLandlord.message === 'success') {
      return (
        <Redirect
          to={`/landlord/email-verification/${registerLandlordData.registerLandlord.verificationId}`}
        />
      );
    }
  } else if (onboardingStateData) {
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && <Alert visible={true} text={formatGraphQLError(errorMessage)} />}
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
          <SubmitButton
            text="Create and Find Tenants"
            type="submit"
            loading={loading || registerLandlordLoading}
          />
        </FormContent>
      </Form>
    );
  }
  return null;
}

const FormContent = styled(View)`
  background-color: ${WHITE};
`;

const RowedView = styled(View)`
  flex-direction: row;
`;
const SubmitButton = styled(Button)`
  margin: 15px 0 30px 0;
`;
