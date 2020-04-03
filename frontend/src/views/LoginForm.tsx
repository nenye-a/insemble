import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useHistory, Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { TextInput, Button, View, Form, Alert } from '../core-ui';
import { validateEmail } from '../utils/validation';
import { LOGIN_TENANT, LOGIN_LANDLORD } from '../graphql/queries/server/auth';
import { CREATE_BRAND } from '../graphql/queries/server/brand';
import { LoginTenant, LoginTenantVariables } from '../generated/LoginTenant';
import { LoginLandlord, LoginLandlordVariables } from '../generated/LoginLandlord';
import { CreateBrand, CreateBrandVariables } from '../generated/CreateBrand';
import { getBusinessAndFilterParams, saveCredentials } from '../utils';
import { Role } from '../types/types';
import {
  GET_TENANT_ONBOARDING_STATE,
  UPDATE_TENANT_ONBOARDING,
} from '../graphql/queries/client/tenantOnboarding';
import { TenantOnboardingState, initialTenantOnboardingState } from '../graphql/localState';

type Props = {
  role: Role;
};

export default function Login(props: Props) {
  let history = useHistory();
  let { role } = props;
  let { register, handleSubmit, errors } = useForm();
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  let { data: onboardingStateData } = useQuery<TenantOnboardingState>(GET_TENANT_ONBOARDING_STATE);
  let [tenantLogin, { data, loading, error }] = useMutation<LoginTenant, LoginTenantVariables>(
    LOGIN_TENANT
  );
  let [updateTenantOnboarding] = useMutation(UPDATE_TENANT_ONBOARDING);
  let [
    landlordLogin,
    { data: landlordData, loading: landlordLoading, error: landlordError },
  ] = useMutation<LoginLandlord, LoginLandlordVariables>(LOGIN_LANDLORD);
  let [
    createBrand,
    { data: createBrandData, loading: createBrandLoading, error: createBrandError },
  ] = useMutation<CreateBrand, CreateBrandVariables>(CREATE_BRAND);

  let onSubmit = (data: FieldValues) => {
    let { email, password } = data;
    tenantLogin({
      variables: { email, password },
    });
  };

  let createNewBrand = () => {
    if (onboardingStateData) {
      let {
        confirmBusinessDetail,
        tenantGoals,
        targetCustomers,
        physicalSiteCriteria,
        pendingData,
      } = onboardingStateData.tenantOnboardingState;
      if (pendingData) {
        let params = getBusinessAndFilterParams(
          confirmBusinessDetail,
          tenantGoals,
          targetCustomers,
          physicalSiteCriteria
        );
        createBrand({
          variables: {
            ...params,
          },
        });
        updateTenantOnboarding({ variables: { ...initialTenantOnboardingState } });
      }
    }
  };

  useEffect(() => {
    if (!loading && data) {
      let { loginTenant } = data;
      let { token, brandId } = loginTenant;

      saveCredentials({
        tenantToken: token,
        role: Role.TENANT,
      });

      if (brandId) {
        if (onboardingStateData?.tenantOnboardingState.pendingData) {
          createNewBrand();
        } else {
          history.push(`/map/${brandId}`);
        }
      } else {
        history.push('/user/brands');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (!createBrandLoading) {
    if (createBrandData) {
      return (
        <Redirect
          to={{
            pathname: `/map/${createBrandData.createBrand}`,
            state: { newBrand: true },
          }}
        />
      );
    } else if (createBrandError && data) {
      // redirect to map with previous brandId
      return <Redirect to={`/map/${data.loginTenant.brandId}`} />;
    }
  }

  //TODO: Check did landlord have property (for which page we should redirect)
  let onSubmitLandlord = (landlordData: FieldValues) => {
    let { email, password } = landlordData;
    landlordLogin({
      variables: { email, password },
    });
  };

  if (landlordData) {
    let { loginLandlord } = landlordData;
    let { token } = loginLandlord;
    saveCredentials({
      landlordToken: token,
      role: Role.LANDLORD,
    });

    return <Redirect to={{ pathname: `/landlord/properties/`, state: { signedIn: true } }} />;
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
  width: 100%;
`;
const SubmitButton = styled(Button)`
  margin: 15px 0 10px 0;
  width: 100%;
`;
