import { mutationField, stringArg, arg } from 'nexus';
import { Context } from 'serverTypes';

import stripe from '../../config/stripe';
import { changeDefaultPaymentMethodResolver } from './paymentMethodMutation';
import { subscriptionPlansCheck } from '../../constants/subscriptions';
import { getBillingAnchor } from '../../helpers/getBillingAnchor';
// TODO: Handle declined card
// TODO: Handle recurring payment

export let createLandlordSubscription = mutationField(
  'createLandlordSubscription',
  {
    type: 'Subscription',
    args: {
      planId: stringArg({ required: true }),
      spaceId: stringArg({ required: true }),
      paymentMethodId: stringArg({ required: false }),
    },
    resolve: async (
      _,
      { planId, spaceId, paymentMethodId },
      context: Context,
      info,
    ) => {
      let subscriptionPlan = subscriptionPlansCheck.find(
        (plan) => plan.id === planId,
      );
      if (!subscriptionPlan) {
        throw new Error('No plan found.');
      }
      if (subscriptionPlan.role === 'TENANT') {
        throw new Error('This is tenant plan.');
      }
      let user = await context.prisma.landlordUser.findOne({
        where: {
          id: context.landlordUserId,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.stripeCustomerId) {
        throw new Error('User has not been connected with Stripe');
      }
      let space = await context.prisma.space.findOne({
        where: {
          id: spaceId,
        },
      });
      if (!space) {
        throw new Error('Space not found.');
      }
      if (space.stripeSubscriptionId) {
        throw new Error('Space already have subscription');
      }
      if (paymentMethodId) {
        await changeDefaultPaymentMethodResolver(
          _,
          { paymentMethodId },
          context,
          info,
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
        billing_cycle_anchor: getBillingAnchor(subscriptionPlan.cycle),
        proration_behavior: 'always_invoice',
        metadata: { spaceId },
      });
      if (!plan) {
        throw new Error('Plan not found');
      }
      await context.prisma.space.update({
        where: {
          id: spaceId,
        },
        data: {
          stripeSubscriptionId: subscriptionId,
        },
      });
      await context.prisma.subscriptionLandlordHistory.create({
        data: {
          subscriptionId,
          landlordUser: {
            connect: {
              id: context.landlordUserId,
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

type SubscriptionInput = {
  spaceId: string;
  planId: string;
};

export let createManyLandlordSubscription = mutationField(
  'createManyLandlordSubscription',
  {
    type: 'Subscription',
    list: true,
    args: {
      subscriptionsInput: arg({
        type: 'LandlordSubscriptionInput',
        list: true,
        required: true,
      }),
      paymentMethodId: stringArg({ required: false }),
    },
    resolve: async (
      _,
      { subscriptionsInput, paymentMethodId },
      context: Context,
      info,
    ) => {
      let filteredInput: Array<SubscriptionInput & {
        cycle: 'MONTHLY' | 'ANNUALLY';
      }> = [];
      for (let subscriptionInput of subscriptionsInput) {
        let subscriptionPlan = subscriptionPlansCheck.find(
          (plan) => plan.id === subscriptionInput.planId,
        );
        if (subscriptionPlan && subscriptionPlan.role === 'LANDLORD') {
          let space = await context.prisma.space.findOne({
            where: {
              id: subscriptionInput.spaceId,
            },
          });
          if (
            space &&
            !space.stripeSubscriptionId &&
            !filteredInput.some(
              ({ spaceId }) => spaceId === subscriptionInput.spaceId,
            )
          ) {
            filteredInput.push({
              ...subscriptionInput,
              cycle: subscriptionPlan.cycle,
            });
          }
        }
      }
      let user = await context.prisma.landlordUser.findOne({
        where: {
          id: context.landlordUserId,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.stripeCustomerId) {
        throw new Error('User has not been connected with Stripe');
      }
      if (paymentMethodId) {
        await changeDefaultPaymentMethodResolver(
          _,
          { paymentMethodId },
          context,
          info,
        );
      }
      let arrayOfResult = [];
      for (let filteredSubscriptionInput of filteredInput) {
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
              plan: filteredSubscriptionInput.planId,
            },
          ],
          billing_cycle_anchor: getBillingAnchor(
            filteredSubscriptionInput.cycle,
          ),
          metadata: { spaceId: filteredSubscriptionInput.spaceId },
        });
        if (!plan) {
          throw new Error('Plan not found');
        }
        await context.prisma.space.update({
          where: {
            id: filteredSubscriptionInput.spaceId,
          },
          data: {
            stripeSubscriptionId: subscriptionId,
          },
        });
        await context.prisma.subscriptionLandlordHistory.create({
          data: {
            subscriptionId,
            landlordUser: {
              connect: {
                id: context.landlordUserId,
              },
            },
          },
        });
        let { product, id } = plan;
        let returnResult = {
          id: subscriptionId,
          currentPeriodStart,
          currentPeriodEnd,
          plan: {
            id,
            productId: product,
          },
          status,
        };
        arrayOfResult.push(returnResult);
      }

      return arrayOfResult;
    },
  },
);
