import { enumType } from 'nexus';
/**
 * Learn more about billing status: https://stripe.com/docs/billing/invoices/workflow#workflow-overview
 */
export let billingStatus = enumType({
  name: 'BillingStatus',
  members: ['draft', 'open', 'paid', 'uncollectible', 'void'],
});
