import gql from 'graphql-tag';

export const FORGOT_PASSWORD_LANDLORD = gql`
  mutation ForgotPasswordLandlord($email: String!) {
    forgotPasswordLandlord(email: $email)
  }
`;

export const FORGOT_PASSWORD_TENANT = gql`
  mutation ForgotPasswordTenant($email: String!) {
    forgotPasswordTenant(email: $email)
  }
`;

export const RESET_PASSWORD_LANDLORD = gql`
  mutation ResetPasswordLandlord($password: String!, $verificationCode: String!) {
    resetPasswordLandlord(password: $password, verificationCode: $verificationCode) {
      message
      verificationId
    }
  }
`;

export const RESET_PASSWORD_TENANT = gql`
  mutation ResetPasswordTenant($password: String!, $verificationCode: String!) {
    resetPasswordTenant(password: $password, verificationCode: $verificationCode) {
      message
      verificationId
    }
  }
`;

export const VERIFY_RESET_PASSWORD_LANDLORD = gql`
  query VerifyResetPasswordLandlord($verificationCode: String!) {
    resetPasswordLandlordVerification(verificationCode: $verificationCode) {
      message
      verificationId
    }
  }
`;

export const VERIFY_RESET_PASSWORD_TENANT = gql`
  query VerifyResetPasswordTenant($verificationCode: String!) {
    resetPasswordTenantVerification(verificationCode: $verificationCode) {
      message
      verificationId
    }
  }
`;
