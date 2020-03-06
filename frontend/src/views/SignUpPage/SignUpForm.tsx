import React from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import { View, TextInput, Form, Button, Alert } from '../../core-ui';
import { validateEmail } from '../../utils/validation';
import { WHITE } from '../../constants/colors';
import { REGISTER_TENANT, REGISTER_LANDLORD } from '../../graphql/queries/server/auth';
import { RegisterTenant, RegisterTenantVariables } from '../../generated/RegisterTenant';
import { State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import { Role } from '../../types/types';
import { formatGraphQLError } from '../../utils';

type Props = {
  role: Role;
  onboardingState?: OnboardingState;
};

export default function SignUpForm(props: Props) {
  let { onboardingState, role } = props;
  let { register, handleSubmit, errors, watch } = useForm();
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
          location: confirmBusinessDetail.location,
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
    // call be
  };

  let submitRegisterTenant = (data: FieldValues) => {
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
        ...getBussinessAndFilterParams(),
      },
    });
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
        <SubmitButton
          text="Create and Submit"
          type="submit"
          loading={loading || registerLandlordLoading}
        />
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
