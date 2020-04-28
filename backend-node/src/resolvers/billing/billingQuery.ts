import { queryField, stringArg, intArg, arg } from 'nexus';
import { Root, Context } from 'serverTypes';
import { Stripe } from 'stripe';

import stripe from '../../config/stripe';
import getUserDetails from '../../helpers/getUserDetails';

let billingList = queryField('billingList', {
  type: 'Billing',
  list: true,
  args: {
    limit: intArg(),
    startingAfter: stringArg(),
    endingBefore: stringArg(),
    status: arg({
      type: 'BillingStatus',
      nullable: true,
    }),
  },
  resolve: async (
    _: Root,
    { limit, startingAfter, endingBefore, status },
    context: Context,
  ) => {
    let { tenantUserId, landlordUserId } = context;
    if (tenantUserId || landlordUserId) {
      let userDetail = await getUserDetails(context);
      let invoices = await stripe.invoices.list({
        limit,
        starting_after: startingAfter,
        ending_before: endingBefore,
        customer: userDetail?.stripeCustomerId,
        status,
        expand: [
          'data.customer',
          'data.payment_intent.payment_method.card',
          'data.subscription',
        ],
      });
      return invoices.data.map(
        ({
          id,
          amount_due: amountDue,
          amount_paid: amountPaid,
          amount_remaining: amountRemaining,
          billing_reason: billingReason,
          payment_intent: paymentIntent,
          subscription,
          paid,
          status_transitions: {
            finalized_at: finalizedAt,
            voided_at: voidedAt,
            paid_at: paidAt,
            marked_uncollectible_at: markedUncollectibleAt,
          },
          status,
        }: Stripe.Invoice) => {
          let paymentMethodData =
            typeof paymentIntent !== 'string' &&
            typeof paymentIntent?.payment_method !== 'string' &&
            typeof paymentIntent?.payment_method?.card !== 'string' &&
            paymentIntent?.payment_method
              ? {
                  id: paymentIntent.payment_method.id,
                  expMonth: paymentIntent.payment_method.card?.exp_month,
                  expYear: paymentIntent.payment_method.card?.exp_year,
                  lastFourDigits: paymentIntent.payment_method.card?.last4,
                }
              : null;
          let subscriptionData =
            typeof subscription !== 'string' && subscription
              ? {
                  id: subscription.id,
                  currentPeriodStart: subscription.current_period_start,
                  currentPeriodEnd: subscription.current_period_end,
                  status: subscription.status,
                  plan: {
                    id: subscription.plan?.id,
                    productId: subscription.plan?.product,
                  },
                }
              : null;

          return {
            id,
            amountDue: convertToDollars(amountDue),
            amountPaid: convertToDollars(amountPaid),
            amountRemaining: convertToDollars(amountRemaining),
            billingReason,
            subscription: subscriptionData,
            paid,
            paymentMethod: paymentMethodData,
            statusTransition: {
              finalizedAt: finalizedAt ? finalizedAt * 1000 : null,
              voidedAt: voidedAt ? voidedAt * 1000 : null,
              paidAt: paidAt ? paidAt * 1000 : null,
              markedUncollectibleAt: markedUncollectibleAt
                ? markedUncollectibleAt * 1000
                : null,
            },
            status,
          };
        },
      );
    }
    throw new Error('Not Authorized');
  },
});

function convertToDollars(amount: number) {
  /* Stripe sends the amount in cents, so we have to convert it
   * https://stripe.com/docs/api/invoices/object
   */
  return amount / 100;
}

export { billingList };
