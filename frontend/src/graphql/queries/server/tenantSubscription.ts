import gql from 'graphql-tag';

export const CREATE_PLAN_SUBSCRIPTION = gql`
  mutation CreateTenantPlanSubscription($planId: String!, $paymentMethodId: String) {
    createTenantSubscription(planId: $planId, paymentMethodId: $paymentMethodId) {
      id
      plan {
        productId
      }
    }
  }
`;

export const EDIT_TENANT_SUBSCRIPTION = gql`
  mutation EditTenantSubscription($planId: String!, $paymentMethodId: String) {
    editTenantSubscription(planId: $planId, paymentMethodId: $paymentMethodId) {
      id
      status
    }
  }
`;
