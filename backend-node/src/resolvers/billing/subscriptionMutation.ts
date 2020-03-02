import { mutationField, stringArg } from 'nexus';
import { Context } from 'serverTypes';

import stripe from '../../config/stripe';
import getUserDetails from '../../helpers/getUserDetails';

// TODO: Handle declined card
// TODO: Handle recurring payment

export let createTenantSubscription = mutationField(
  'createTenantSubscription',
  {
    type: 'Subscription',
    args: {
      planId: stringArg(),
      // NOTE: When paymentMethodId isn't specified, Stripe will use customer's default payment method
      paymentMethodId: stringArg({ required: false }),
    },
    resolve: async (_, { planId, paymentMethodId }, context: Context) => {
      let user = await getUserDetails(context);
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.stripeCustomerId) {
        throw new Error('User has not been connected with Stripe');
      }
      let {
        id: subscriptionId,
        current_period_end: currentPeriodEnd,
        current_period_start: currentPeriodStart,
        plan,
        status,
      } = await stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [
          {
            plan: planId,
          },
        ],
        default_payment_method: paymentMethodId,
      });
      if (!plan) {
        throw new Error('Plan not found');
      }
      context.prisma.subscriptionTenantHistory.create({
        data: {
          subscriptionId,
          tenantUser: {
            connect: {
              id: context.tenantUserId,
            },
          },
        },
      });

      let { product, id } = plan;
      return {
        id: subscriptionId,
        currentPeriodStart,
        currentPeriodEnd,
        plan: {
          id,
          productId: product,
        },
        status,
      };
    },
  },
);
