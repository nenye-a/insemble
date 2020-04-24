import { mutationField, stringArg, FieldResolver } from 'nexus';
import { Context } from 'serverTypes';

import stripe from '../../config/stripe';
import { changeDefaultPaymentMethodResolver } from './paymentMethodMutation';
import { subscriptionPlansCheck } from '../../constants/subscriptions';
import { defaultPaymentCheck } from '../../helpers/defaultPaymentCheck';
import { upgradePlanCheck } from '../../helpers/upgradePlanCheck';

// TODO: Handle declined card
// TODO: Handle recurring payment

export let createTenantSubscription = mutationField(
  'createTenantSubscription',
  {
    type: 'Subscription',
    args: {
      planId: stringArg({ required: true }),
      paymentMethodId: stringArg({ required: false }),
    },
    resolve: async (_, { planId, paymentMethodId }, context: Context, info) => {
      let subscriptionPlan = subscriptionPlansCheck.find(
        (plan) => plan.id === planId,
      );
      if (!subscriptionPlan) {
        throw new Error('No plan found.');
      }
      if (subscriptionPlan.role === 'LANDLORD') {
        throw new Error('This is landlord plan.');
      }
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
      if (user.stripeSubscriptionId) {
        throw new Error('User already have subscription');
      }
      if (paymentMethodId) {
        await changeDefaultPaymentMethodResolver(
          _,
          { paymentMethodId },
          context,
          info,
        );
      }
      let thereIsDefaultPayment = await defaultPaymentCheck(
        user.stripeCustomerId,
      );
      if (!thereIsDefaultPayment) {
        throw new Error(
          'There is no default payment. Please register the card first.',
        );
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
      });
      if (!plan) {
        throw new Error('Plan not found');
      }
      await context.prisma.tenantUser.update({
        where: {
          id: context.tenantUserId,
        },
        data: {
          stripeSubscriptionId: subscriptionId,
        },
      });
      await context.prisma.subscriptionTenantHistory.create({
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

export let editTenantSubscription = mutationField('editTenantSubscription', {
  type: 'Subscription',
  args: {
    planId: stringArg({ required: true }),
    // NOTE: When paymentMethodId isn't specified, Stripe will use customer's default payment method
    paymentMethodId: stringArg({ required: false }),
  },
  resolve: async (_, { planId, paymentMethodId }, context: Context, info) => {
    let subscriptionPlan = subscriptionPlansCheck.find(
      (plan) => plan.id === planId,
    );
    if (!subscriptionPlan) {
      throw new Error('No plan found.');
    }
    if (subscriptionPlan.role === 'LANDLORD') {
      throw new Error('This is landlord plan.');
    }
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

    if (!user.stripeSubscriptionId) {
      throw new Error('User has not been connected to any subscription');
    }
    const selectedSubscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
    );
    if (!selectedSubscription) {
      throw new Error('Subscription not found.');
    }
    if (paymentMethodId) {
      await changeDefaultPaymentMethodResolver(
        _,
        { paymentMethodId },
        context,
        info,
      );
    }
    let thereIsDefaultPayment = await defaultPaymentCheck(
      user.stripeCustomerId,
    );
    if (!thereIsDefaultPayment) {
      throw new Error(
        'There is no default payment. Please register the card first.',
      );
    }
    let currentPlanId = selectedSubscription.items.data[0].plan.id;
    let currentSubscriptionPlan = subscriptionPlansCheck.find(
      (plan) => plan.id === currentPlanId,
    );
    if (!currentSubscriptionPlan) {
      throw new Error(
        `Current subscription plan with ${currentPlanId} is not found.`,
      );
    }
    let {
      id: subscriptionId,
      current_period_end: currentPeriodEnd,
      current_period_start: currentPeriodStart,
      plan,
      status,
    } = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      items: [
        {
          id: selectedSubscription.items.data[0].id,
          plan: planId,
        },
      ],
      proration_behavior: upgradePlanCheck(
        currentSubscriptionPlan,
        subscriptionPlan,
      )
        ? 'always_invoice'
        : 'none',
      cancel_at_period_end: false,
    });
    if (!plan) {
      throw new Error('Plan not found');
    }
    await context.prisma.subscriptionTenantHistory.create({
      data: {
        subscriptionId,
        action: 'CHANGE',
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
});

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
  if (!user.stripeSubscriptionId) {
    throw new Error('User has not been connected to any subscription');
  }
  let cancelAt;
  try {
    let subs = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    cancelAt = subs.cancel_at * 1000;
  } catch {
    throw new Error('Failed to cancel subscription');
  }
  return new Date(cancelAt);
};

export let cancelTenantSubscription = mutationField(
  'cancelTenantSubscription',
  {
    type: 'DateTime',
    resolve: cancelTenantSubscriptionResolver,
  },
);

export let undoCancelTenantSubscriptionResolver: FieldResolver<
  'Mutation',
  'undoCancelTenantSubscription'
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

  if (!user.stripeSubscriptionId) {
    throw new Error('User has not been connected to any subscription');
  }
  let thereIsDefaultPayment = await defaultPaymentCheck(user.stripeCustomerId);
  if (!thereIsDefaultPayment) {
    throw new Error(
      'There is no default payment. Please register the card first.',
    );
  }
  let message = 'Success';
  try {
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
  } catch {
    message = 'Failed to undo cancelation';
  }
  return message;
};

export let undoCancelTenantSubscription = mutationField(
  'undoCancelTenantSubscription',
  {
    type: 'String',
    resolve: undoCancelTenantSubscriptionResolver,
  },
);
