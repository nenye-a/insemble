import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import {
  View,
  TextInput,
  Form,
  Button,
  Alert,
  Checkbox,
  Text,
  TouchableOpacity,
} from '../../core-ui';
import { validateEmail } from '../../utils/validation';
import { WHITE, LINK_COLOR } from '../../constants/colors';
import { REGISTER_TENANT, REGISTER_LANDLORD } from '../../graphql/queries/server/auth';
import { RegisterTenant, RegisterTenantVariables } from '../../generated/RegisterTenant';
import { State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import { Role } from '../../types/types';
import { formatGraphQLError, getBusinessAndFilterParams } from '../../utils';
import { PRIVACY_POLICY_PDF, TERMS_OF_SERVICE_PDF } from '../../constants/app';

type Props = {
  role: Role;
  onboardingState?: OnboardingState;
};

export default function SignUpForm(props: Props) {
  let { onboardingState, role } = props;
  let { register, handleSubmit, errors, watch } = useForm();
  let [hasAgreed, setHasAgreed] = useState(false);
  let [registerTenant, { data, loading, error }] = useMutation<
    RegisterTenant,
    RegisterTenantVariables
  >(REGISTER_TENANT);
  let [
    registerLandlord,
    { data: registerLandlordData, loading: registerLandlordLoading, error: registerLandlordError },
  ] = useMutation(REGISTER_LANDLORD);
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

    let businessAndFilterParams =
      onboardingState &&
      getBusinessAndFilterParams(
        onboardingState.confirmBusinessDetail,
        onboardingState.tenantGoals,
        onboardingState.targetCustomers,
        onboardingState.physicalSiteCriteria
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
  };

  let onSubmit = (data: FieldValues) => {
    if (Object.keys(errors).length === 0 && hasAgreed) {
      if (role === Role.LANDLORD) {
        submitRegisterLandlord(data);
      } else {
        submitRegisterTenant(data);
      }
    }
  };

  if (data) {
    if (data.registerTenant.message === 'success') {
      return <Redirect to={`/email-verification/${data.registerTenant.verificationId}`} />;
    }
  }

  if (registerLandlordData) {
    if (registerLandlordData.registerLandlord.message === 'success') {
      return (
        <Redirect
          to={`/landlord/email-verification/${registerLandlordData.registerLandlord.verificationId}`}
        />
      );
    }
  }

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
        <Checkbox
          type="primary"
          title={
            <View style={{ flexDirection: 'row' }}>
              <Text> I accept the </Text>
              <TouchableText text="Privacy Policy" link={PRIVACY_POLICY_PDF} />
              <Text> and the </Text>
              <TouchableText text="Terms of Service" link={TERMS_OF_SERVICE_PDF} />
            </View>
          }
          isChecked={hasAgreed}
          onPress={() => setHasAgreed(!hasAgreed)}
        />
        <SubmitButton
          text={role === Role.LANDLORD ? 'Create and Find Tenants' : 'Create and Submit'}
          type="submit"
          loading={loading || registerLandlordLoading}
        />
      </FormContent>
    </Form>
  );
}

type TouchableTextProps = {
  link: string;
  text: string;
};
function TouchableText({ text, link }: TouchableTextProps) {
  return (
    <TouchableOpacity href={link}>
      <Text style={{ color: LINK_COLOR }}>{text}</Text>
    </TouchableOpacity>
  );
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
