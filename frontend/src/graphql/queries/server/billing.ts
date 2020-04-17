import gql from 'graphql-tag';

export const GET_BILLING_LIST = gql`
  query BillingList(
    $status: BillingStatus
    $startingAfter: String
    $endingBefore: String
    $limit: Int
  ) {
    billingList(
      status: $status
      startingAfter: $startingAfter
      endingBefore: $endingBefore
      limit: $limit
    ) {
      id
      amountPaid
      paid
      status
      subscription {
        id
        currentPeriodStart
        currentPeriodEnd
        status
      }
      paymentMethod {
        lastFourDigits
      }
      statusTransition {
        paidAt
      }
    }
  }
`;

export const GET_PAYMENT_METHOD_LIST = gql`
  query PaymentMethodList($startingAfter: String, $endingBefore: String, $limit: Int) {
    paymentMethodList(startingAfter: $startingAfter, endingBefore: $endingBefore, limit: $limit) {
      id
      expMonth
      expYear
      lastFourDigits
      isDefault
    }
  }
`;

export const REGISTER_PAYMENT_METHOD = gql`
  mutation RegisterPaymentMethod($paymentMethodId: String!) {
    registerPaymentMethod(paymentMethodId: $paymentMethodId) {
      id
    }
  }
`;

export const REMOVE_PAYMENT_METHOD = gql`
  mutation RemovePaymentMethod($paymentMethodId: String!) {
    removePaymentMethod(paymentMethodId: $paymentMethodId) {
      id
    }
  }
`;

export const CHANGE_DEFAULT_PAYMENT_METHOD = gql`
  mutation ChangeDefaultPaymentMethod($paymentMethodId: String!) {
    changeDefaultPaymentMethod(paymentMethodId: $paymentMethodId)
  }
`;

export const CANCEL_TENANT_SUBSCRIPTION = gql`
  mutation CancelTenantSubcription {
    cancelTenantSubscription
  }
`;
