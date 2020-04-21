import gql from 'graphql-tag';

export const CREATE_LANDLORD_PLAN_SUBSCRIPTION = gql`
  mutation CreateLandlordSubscription(
    $planId: String!
    $spaceId: String!
    $paymentMethodId: String
  ) {
    createLandlordSubscription(
      planId: $planId
      spaceId: $spaceId
      paymentMethodId: $paymentMethodId
    ) {
      id
      currentPeriodStart
      currentPeriodEnd
      status
      plan {
        id
        productId
      }
    }
  }
`;

export const EDIT_LANDLORD_PLAN_SUBSCRIPTION = gql`
  mutation EditLandlordSubscription($planId: String!, $spaceId: String!, $paymentMethodId: String) {
    createLandlordSubscription(
      planId: $planId
      spaceId: $spaceId
      paymentMethodId: $paymentMethodId
    ) {
      id
      currentPeriodStart
      currentPeriodEnd
      status
      plan {
        id
        productId
      }
    }
  }
`;

export const GET_LANDLORD_SUBSCRIPTIONS_LIST = gql`
  query GetSubscriptionsList {
    landlordSubscriptions {
      id
      tier
      mainPhoto
      location {
        id
        address
        lat
        lng
      }
      spaceIndex
      cost
      canceledAt
      plan {
        id
        productId
      }
    }
  }
`;

export const EDIT_MANY_LANDLORD_PLAN_SUSBCRIPTION = gql`
  mutation EditManyLandlordSubscription(
    $subscriptionsInput: [LandlordSubscriptionInput!]!
    $paymentMethodId: String
  ) {
    editManyLandlordSubscription(
      subscriptionsInput: $subscriptionsInput
      paymentMethodId: $paymentMethodId
    ) {
      id
      currentPeriodStart
      currentPeriodEnd
      status
      plan {
        id
        productId
      }
    }
  }
`;
