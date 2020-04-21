import { objectType } from 'nexus';

export let StatusTransition = objectType({
  name: 'StatusTransition',
  definition(t) {
    t.date('finalizedAt', { nullable: true });
    t.date('voidedAt', { nullable: true });
    t.date('paidAt', { nullable: true });
    t.date('markedUncollectibleAt', { nullable: true });
  },
});

export let Billing = objectType({
  name: 'Billing',
  definition(t) {
    t.string('id');
    t.float('amountDue');
    t.float('amountPaid');
    t.float('amountRemaining');
    t.string('billingReason');
    t.boolean('paid');
    t.string('status');
    t.field('subscription', { type: 'Subscription', nullable: true });
    t.field('paymentMethod', { type: 'PaymentMethod', nullable: true });
    t.field('status', { type: 'BillingStatus' });
    t.field('statusTransition', { type: 'StatusTransition' });
  },
});
