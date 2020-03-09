import { enumType } from 'nexus';

export let subscriptionStatus = enumType({
  name: 'SubscriptionStatus',
  members: [
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
  ],
});
