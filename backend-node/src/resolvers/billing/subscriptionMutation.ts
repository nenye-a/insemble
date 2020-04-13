import { mutationField, stringArg, FieldResolver } from 'nexus';
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

export let cancelTenantSubscriptionResolver: FieldResolver<
  'Mutation',
  'cancelTenantSubscription'
> = async (_, __, context: Context) => {
  let user = await context.prisma.tenantUser.findOne({
    where: {
      id: context.tenantUserId,
    },
  });
  if (!user) {
    throw new Error('User not found');
  }
  if (!user.stripeCustomerId) {
    throw new Error('User has not been connected with Stripe');
  }
  try {
    await stripe.subscriptions.del(user.stripeSubscriptionId);
    await context.prisma.tenantUser.update({
      where: {
        stripeCustomerId: user.stripeCustomerId,
      },
      data: {
        tier: 'FREE',
        stripeSubscriptionId: null,
      },
    });
  } catch {
    throw new Error('Failed to cancel subscription');
  }
  return 'Success';
};

export let cancelTenantSubscription = mutationField(
  'cancelTenantSubscription',
  {
    type: 'String',
    resolve: cancelTenantSubscriptionResolver,
  },
);
