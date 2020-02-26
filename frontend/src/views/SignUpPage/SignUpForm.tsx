import React from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { View, TextInput, Form, Button, Alert } from '../../core-ui';
import { validateEmail } from '../../utils/validation';
import { WHITE } from '../../constants/colors';
import { REGISTER_TENANT } from '../../graphql/queries/server/auth';
import { RegisterTenant, RegisterTenantVariables } from '../../generated/RegisterTenant';
import { State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import { Role } from '../../types/types';

type Props = {
  role: Role;
  onboardingState?: OnboardingState;
  signUpFirst?: boolean; // whether the user sign up or fill the onboarding form first
};

export default function SignUpForm(props: Props) {
  let { onboardingState } = props;
  let { register, handleSubmit, errors, watch } = useForm();
  let history = useHistory();
  let [registerTenant, { data, loading, error }] = useMutation<
    RegisterTenant,
    RegisterTenantVariables
  >(REGISTER_TENANT);
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };

  let getBussinessAndFilterParams = () => {
    if (onboardingState) {
      let {
        confirmBusinessDetail,
        tenantGoals,
        targetCustomers,
        physicalSiteCriteria,
      } = onboardingState;
      return {
        business: {
          name: confirmBusinessDetail.name,
          userRelation:
            confirmBusinessDetail.userRelation === 'Other'
              ? confirmBusinessDetail.otherUserRelation || ''
              : confirmBusinessDetail.userRelation,
          location: confirmBusinessDetail.location || { lat: '', lng: '', address: '' },
          locationCount: tenantGoals.locationCount ? Number(tenantGoals.locationCount) : null,
          newLocationPlan: tenantGoals.newLocationPlan?.value,
          nextLocations: tenantGoals.location,
        },
        filter: {
          categories: confirmBusinessDetail.categories,
          personas: targetCustomers.noPersonasPreference ? null : targetCustomers.personas,
          education: targetCustomers.noEducationsPreference ? null : targetCustomers.educations,
          minDaytimePopulation: targetCustomers.noMinDaytimePopulationPreference
            ? null
            : Number(targetCustomers.minDaytimePopulation),
          minAge: targetCustomers.noAgePreference ? null : Number(targetCustomers.minAge),
          maxAge: targetCustomers.noAgePreference ? null : Number(targetCustomers.maxAge),
          minIncome: targetCustomers.noIncomePreference
            ? null
            : Number(targetCustomers.minIncome) * 1000,
          maxIncome: targetCustomers.noIncomePreference
            ? null
            : Number(targetCustomers.maxIncome) * 1000,
          minSize: Number(physicalSiteCriteria.minSize),
          minFrontageWidth: Number(physicalSiteCriteria.minFrontageWidth),
          spaceType: physicalSiteCriteria.spaceType,
          equipment: physicalSiteCriteria.equipments,
        },
      };
    }
  };

  let onSubmit = (data: FieldValues) => {
    let { email, firstName, lastName, company, password } = data;
    if (Object.keys(errors).length === 0) {
      registerTenant({
        variables: {
          tenant: {
            email,
            firstName,
            lastName,
            company,
            password,
          },
          ...getBussinessAndFilterParams(),
        },
      });
    }
  };

  if (data) {
    if (data.registerTenant.message === 'success') {
      history.push(`/email-verification/${data.registerTenant.verificationId}`);
    } else {
      // TODO: error handling
    }
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {!!error && <Alert visible={true} text={error.toString()} />}
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
`;

const RowedView = styled(View)`
  flex-direction: row;
`;
const SubmitButton = styled(Button)`
  margin: 15px 0 30px 0;
`;
