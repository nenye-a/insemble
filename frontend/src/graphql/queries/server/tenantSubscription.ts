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
