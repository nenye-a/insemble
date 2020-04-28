import { mutationField, stringArg, arg, FieldResolver } from 'nexus';
import { Context } from 'serverTypes';

import stripe from '../../config/stripe';
import { changeDefaultPaymentMethodResolver } from './paymentMethodMutation';
import { subscriptionPlansCheck } from '../../constants/subscriptions';
import { getBillingAnchor } from '../../helpers/getBillingAnchor';
import { defaultPaymentCheck } from '../../helpers/defaultPaymentCheck';
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
        include: { property: { include: { landlordUser: true } } },
      });
      if (!space) {
        throw new Error('Space not found.');
      }
      if (space.stripeSubscriptionId) {
        throw new Error('Space already have subscription');
      }
      if (!space.property) {
        throw new Error('Selected space does not connected to property');
      }
      if (space.property.landlordUser.id !== context.landlordUserId) {
        throw new Error('You can not cancel other landlord subscription');
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
            include: { property: { include: { landlordUser: true } } },
          });
          if (
            space &&
            !space.stripeSubscriptionId &&
            space.property?.landlordUser.id === context.landlordUserId &&
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
      let thereIsDefaultPayment = await defaultPaymentCheck(
        user.stripeCustomerId,
      );
      if (!thereIsDefaultPayment) {
        throw new Error(
          'There is no default payment. Please register the card first.',
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

export let editLandlordSubscription = mutationField(
  'editLandlordSubscription',
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
      let subscriptionPlan = subscriptionPlansCheck.find(
        (plan) => plan.id === planId,
      );
      if (!subscriptionPlan) {
        throw new Error('No plan found.');
      }
      if (subscriptionPlan.role === 'TENANT') {
        throw new Error('This is tenant plan.');
      }
      let space = await context.prisma.space.findOne({
        where: {
          id: spaceId,
        },
        include: { property: { include: { landlordUser: true } } },
      });
      if (!space) {
        throw new Error('Space not found.');
      }
      if (!space.stripeSubscriptionId) {
        throw new Error('Subscription space not found');
      }
      if (!space.property) {
        throw new Error('Selected space does not connected to property');
      }
      if (space.property.landlordUser.id !== context.landlordUserId) {
        throw new Error('You can not cancel other landlord subscription');
      }
      const selectedSubscription = await stripe.subscriptions.retrieve(
        space.stripeSubscriptionId,
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
      let {
        id: subscriptionId,
        current_period_end: currentPeriodEnd,
        current_period_start: currentPeriodStart,
        plan,
        status,
      } = selectedSubscription;
      if (!plan) {
        throw new Error('Selected subscription plan not found');
      }
      if (plan.id !== planId) {
        let changedSubscriptionId = selectedSubscription.id;
        let {
          id: newSubscriptionId,
          current_period_end: newCurrentPeriodEnd,
          current_period_start: newCurrentPeriodStart,
          plan: newPlan,
          status: newStatus,
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
        // Note: Normal ways to update, doesn't work because it will reset the cycle anchor
        // let {
        //   id: subscriptionId,
        //   current_period_end: currentPeriodEnd,
        //   current_period_start: currentPeriodStart,
        //   plan,
        //   status,
        // } = await stripe.subscriptions.update(space.stripeSubscriptionId, {
        //   items: [
        //     {
        //       id: selectedSubscription.items.data[0].id,
        //       plan: planId,
        //     },
        //   ],
        //   proration_behavior: 'always_invoice',
        //   cancel_at_period_end: false,
        // });
        if (!newPlan) {
          throw new Error('Plan not found');
        }
        subscriptionId = newSubscriptionId;
        currentPeriodEnd = newCurrentPeriodEnd;
        currentPeriodStart = newCurrentPeriodStart;
        plan = newPlan;
        status = newStatus;
        await context.prisma.space.update({
          where: {
            id: spaceId,
          },
          data: {
            stripeSubscriptionId: subscriptionId,
          },
        });
        await stripe.subscriptions.del(changedSubscriptionId, {
          prorate: true,
          invoice_now: true,
        });
        await context.prisma.subscriptionLandlordHistory.create({
          data: {
            subscriptionId,
            action: 'CHANGE',
            landlordUser: {
              connect: {
                id: context.landlordUserId,
              },
            },
          },
        });
      }

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

export let editManyLandlordSubscription = mutationField(
  'editManyLandlordSubscription',
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
      let filteredInput: Array<SubscriptionInput & {
        stripeSubscriptionId: string;
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
            include: { property: { include: { landlordUser: true } } },
          });
          if (
            space &&
            space.stripeSubscriptionId &&
            space.property?.landlordUser.id === context.landlordUserId &&
            !filteredInput.some(
              ({ spaceId }) => spaceId === subscriptionInput.spaceId,
            )
          ) {
            filteredInput.push({
              ...subscriptionInput,
              stripeSubscriptionId: space.stripeSubscriptionId,
              cycle: subscriptionPlan.cycle,
            });
          }
        }
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
      let arrayOfResult = [];
      for (let filteredSubscriptionInput of filteredInput) {
        const selectedSubscription = await stripe.subscriptions.retrieve(
          filteredSubscriptionInput.stripeSubscriptionId,
        );
        if (!selectedSubscription) {
          throw new Error('Subscription not found.');
        }
        let {
          id: subscriptionId,
          current_period_end: currentPeriodEnd,
          current_period_start: currentPeriodStart,
          plan,
          status,
        } = selectedSubscription;
        if (!plan) {
          throw new Error('Selected subscription plan not found');
        }
        if (plan.id !== filteredSubscriptionInput.planId) {
          let changedSubscriptionId = selectedSubscription.id;
          let {
            id: newSubscriptionId,
            current_period_end: newCurrentPeriodEnd,
            current_period_start: newCurrentPeriodStart,
            plan: newPlan,
            status: newStatus,
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
            proration_behavior: 'always_invoice',
            metadata: { spaceId: filteredSubscriptionInput.spaceId },
          });
          // Note: Normal ways to update, doesn't work because it will reset the cycle anchor
          // let {
          //   id: subscriptionId,
          //   current_period_end: currentPeriodEnd,
          //   current_period_start: currentPeriodStart,
          //   plan,
          //   status,
          // } = await stripe.subscriptions.update(
          //   filteredSubscriptionInput.stripeSubscriptionId,
          //   {
          //     items: [
          //       {
          //         id: selectedSubscription.items.data[0].id,
          //         plan: filteredSubscriptionInput.planId,
          //       },
          //     ],
          //     proration_behavior: 'always_invoice',
          //     cancel_at_period_end: false,
          //   },
          // );
          if (!newPlan) {
            throw new Error('Plan not found');
          }
          subscriptionId = newSubscriptionId;
          currentPeriodEnd = newCurrentPeriodEnd;
          currentPeriodStart = newCurrentPeriodStart;
          plan = newPlan;
          status = newStatus;
          await context.prisma.space.update({
            where: {
              id: filteredSubscriptionInput.spaceId,
            },
            data: {
              stripeSubscriptionId: subscriptionId,
            },
          });
          await stripe.subscriptions.del(changedSubscriptionId, {
            prorate: true,
            invoice_now: true,
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
        }
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

export let cancelLandlordSubscriptionResolver: FieldResolver<
  'Mutation',
  'cancelLandlordSubscription'
> = async (_, { spaceId }, context: Context) => {
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
    include: { property: { include: { landlordUser: true } } },
  });
  if (!space) {
    throw new Error('Space not found.');
  }
  if (!space.stripeSubscriptionId) {
    throw new Error('Subscription space not found');
  }
  if (!space.property) {
    throw new Error('Selected space does not connected to property');
  }
  if (space.property.landlordUser.id !== context.landlordUserId) {
    throw new Error('You can not cancel other landlord subscription');
  }
  let cancelAt;
  try {
    let subs = await stripe.subscriptions.update(space.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    cancelAt = subs.cancel_at * 1000;
  } catch {
    throw new Error('Failed to cancel subscription');
  }
  return new Date(cancelAt);
};

export let cancelLandlordSubscription = mutationField(
  'cancelLandlordSubscription',
  {
    type: 'DateTime',
    args: { spaceId: stringArg({ required: true }) },
    resolve: cancelLandlordSubscriptionResolver,
  },
);

export let undoCancelLandlordSubscriptionResolver: FieldResolver<
  'Mutation',
  'undoCancelLandlordSubscription'
> = async (_, { spaceIds }, context: Context) => {
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
  let thereIsDefaultPayment = await defaultPaymentCheck(user.stripeCustomerId);
  if (!thereIsDefaultPayment) {
    throw new Error(
      'There is no default payment. Please register the card first.',
    );
  }
  let filteredInput: Array<string> = [];
  for (let spaceId of spaceIds) {
    if (!filteredInput.includes(spaceId)) {
      filteredInput.push(spaceId);
    }
  }
  let message = 'Success';
  for (let spaceId of filteredInput) {
    let space = await context.prisma.space.findOne({
      where: {
        id: spaceId,
      },
      include: { property: { include: { landlordUser: true } } },
    });
    if (
      space &&
      space.stripeSubscriptionId &&
      space.property?.landlordUser.id === context.landlordUserId
    ) {
      try {
        await stripe.subscriptions.update(space.stripeSubscriptionId, {
          cancel_at_period_end: false,
        });
      } catch {
        message = 'Some space has failed to undo cancelation.';
      }
    }
  }

  return message;
};

export let undoCancelLandlordSubscription = mutationField(
  'undoCancelLandlordSubscription',
  {
    type: 'String',
    args: { spaceIds: stringArg({ required: true, list: true }) },
    resolve: undoCancelLandlordSubscriptionResolver,
  },
);
