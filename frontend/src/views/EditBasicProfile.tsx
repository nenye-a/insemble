import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/react-hooks';
// import { useHistory } from 'react-router-dom';

import {
  Card,
  Text,
  Button,
  TextInput,
  View,
  TextArea as BaseTextArea,
  Form,
  LoadingIndicator,
  Alert,
} from '../core-ui';
import { THEME_COLOR } from '../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../constants/theme';
import { GET_TENANT_PROFILE, EDIT_TENANT_PROFILE } from '../graphql/queries/server/profile';
import { EditTenantProfile, EditTenantProfileVariables } from '../generated/EditTenantProfile';
import { validateUSPhoneNumber } from '../utils/validation';

export default function BasicProfile() {
  // let history = useHistory();
  let [profileEditable, setProfileEditable] = useState(false);
  let [passwordEditable, setPasswordEditable] = useState(false);
  let { data, loading } = useQuery(GET_TENANT_PROFILE);
  let textInputContainerStyle = { marginTop: 12, marginBottom: 12 };
  let { register, watch, handleSubmit, errors } = useForm();
  let [
    editTenantProfile,
    { data: editTenantData, loading: editTenantLoading, error: editTenantError },
  ] = useMutation<EditTenantProfile, EditTenantProfileVariables>(EDIT_TENANT_PROFILE);
  // TODO: check role
  // let {state: {role}} = history.location;
  let onSubmit = (fieldValues: FieldValues) => {
    let {
      email,
      firstName,
      lastName,
      company,
      jobTitle,
      phoneNumber,
      description,
      currentPassword,
      newPassword,
    } = fieldValues;
    if (Object.keys(errors).length === 0) {
      editTenantProfile({
        variables: {
          profile: {
            email,
            firstName,
            lastName,
            company,
            title: jobTitle,
            phoneNumber,
            description,
            oldPassword: currentPassword,
            newPassword,
          },
        },
        refetchQueries: [
          {
            query: GET_TENANT_PROFILE,
          },
        ],
      });
    }
  };

  return (
    <Container flex>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* TODO: change to status message returned by the endpoint */}
          <Alert visible={!!editTenantData} text="Your profile has been updated" />
          <Alert visible={!!editTenantError} text={editTenantError?.message || ''} />
          <RowedView>
            <Title>Profile</Title>
            <Button
              text="Edit Your Profile"
              mode="transparent"
              onPress={() => setProfileEditable(true)}
            />
          </RowedView>
          <TextInput
            label="Email Address"
            placeholder="Email"
            disabled={!profileEditable}
            containerStyle={textInputContainerStyle}
            defaultValue={data?.profileTenant.email}
            name="email"
            errorMessage={
              data?.profileTenant.pendingEmail
                ? 'Your account is pending for e-mail verification. Please check your e-mail'
                : ''
            }
            ref={register({
              required: 'Email should not be empty',
            })}
          />
          <RowedView>
            <TextInput
              label="First Name"
              placeholder="First Name"
              disabled={!profileEditable}
              containerStyle={textInputContainerStyle}
              defaultValue={data?.profileTenant.firstName}
              name="firstName"
              ref={register({
                required: 'First name should not be empty',
              })}
              errorMessage={(errors?.firstName as FieldError)?.message || ''}
            />
            <Spacing />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              disabled={!profileEditable}
              containerStyle={textInputContainerStyle}
              defaultValue={data?.profileTenant.lastName}
              name="lastName"
              ref={register({
                required: 'Last name should not be empty',
              })}
              errorMessage={(errors?.lastName as FieldError)?.message || ''}
            />
          </RowedView>
          <RowedView>
            <TextInput
              label="Company"
              placeholder="Company"
              disabled={!profileEditable}
              containerStyle={textInputContainerStyle}
              defaultValue={data?.profileTenant.company}
              name="company"
              ref={register}
              errorMessage={(errors?.company as FieldError)?.message || ''}
            />
            <Spacing />
            <TextInput
              label="Title"
              placeholder="Job Title"
              disabled={!profileEditable}
              containerStyle={textInputContainerStyle}
              defaultValue={data?.profileTenant.title}
              name="jobTitle"
              ref={register}
              errorMessage={(errors?.jobTitle as FieldError)?.message || ''}
            />
          </RowedView>
          <Title>Public Profile</Title>
          <TextInput
            label="Phone Number"
            placeholder="Phone Number"
            disabled={!profileEditable}
            containerStyle={{
              ...textInputContainerStyle,
              width: `calc(50% - ${(SPACING_WIDTH / 2).toString() + 'px'})`,
            }}
            name="phoneNumber"
            ref={register({
              ...(watch('phoneNumber') && {
                validate: (val) => validateUSPhoneNumber(val) || 'Invalid phone number',
              }),
            })}
            errorMessage={(errors?.phoneNumber as FieldError)?.message || ''}
          />
          <TextArea
            values=""
            label="About"
            disabled={!profileEditable}
            containerStyle={textInputContainerStyle}
            name="description"
            ref={register}
          />
          <RowedView>
            <Title>Password</Title>
            <Button
              text="Change your password"
              mode="transparent"
              onPress={() => setPasswordEditable(true)}
            />
          </RowedView>
          <TextInput
            label="Current Password"
            placeholder="Enter Your Current Password"
            disabled={!passwordEditable}
            type="password"
            containerStyle={textInputContainerStyle}
            name="currentPassword"
            ref={register}
            errorMessage={(errors?.password as FieldError)?.message || ''}
          />
          <TextInput
            label="New Password"
            placeholder="Enter Your New Password"
            disabled={!passwordEditable}
            type="password"
            name="newPassword"
            ref={register({
              required: watch('currentPassword') ? 'New password should not be empty' : false,
            })}
            errorMessage={(errors?.newPassword as FieldError)?.message || ''}
          />
          <TextInput
            label="Confirm New Password"
            placeholder="Re-Enter Your New Password"
            disabled={!passwordEditable}
            type="password"
            containerStyle={textInputContainerStyle}
            name="confirmNewPassword"
            ref={register({
              required: watch('newPassword') ? 'Confirm password should not be empty' : false,
              ...(watch('newPassword') && {
                validate: (val) =>
                  val === watch('newPassword') || 'Confirm password does not match',
              }),
            })}
            errorMessage={(errors?.confirmNewPassword as FieldError)?.message || ''}
          />
          <SaveButton text="Save Changes" type="submit" loading={editTenantLoading} />
        </Form>
      )}
    </Container>
  );
}

const SPACING_WIDTH = 24;
const Container = styled(Card)`
  padding: 12px 24px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const TextArea = styled(BaseTextArea)`
  height: 74px;
`;

const Title = styled(Text)`
  color: ${THEME_COLOR};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 12px 0;
`;

const Spacing = styled(View)`
  width: ${SPACING_WIDTH.toString() + 'px'};
`;

const SaveButton = styled(Button)`
  align-self: flex-end;
  margin: 12px 0;
`;
