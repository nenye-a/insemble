import { objectType } from 'nexus';

export let Plan = objectType({
  name: 'Plan',
  definition(t) {
    t.string('id');
    t.string('productId');
  },
});

export let Subscription = objectType({
  name: 'Subscription',
  definition(t) {
    t.string('id');
    t.int('currentPeriodStart');
    t.int('currentPeriodEnd');
    t.field('status', { type: 'SubscriptionStatus' });
    t.field('plan', { type: 'Plan' });
  },
});
