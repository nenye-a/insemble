import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';
import stripe from '../../config/stripe';
import { LandlordTier } from '@prisma/client';

let landlordSubscriptionsResolver: FieldResolver<
  'Query',
  'landlordSubscriptions'
> = async (_: Root, _args, context: Context) => {
  let user = await context.prisma.landlordUser.findOne({
    where: {
      id: context.landlordUserId,
    },
  });

  if (!user) {
    throw new Error('Not Authorized');
  }
  let dataSubscription = [];
  if (user.stripeCustomerId) {
    let { data } = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
    });
    dataSubscription = data;
  }

  let formatedSubsList = dataSubscription.map(
    // eslint-disable-next-line
    // @ts-ignore
    ({ plan, metadata, id, cancel_at: cancelAt }) => {
      // NOTE: Somehow ts say those variable have any type even though it's already have type
      if (plan) {
        let costPerInterval = plan.amount / 100;
        let cost = `$${costPerInterval}/${plan.interval}`;
        let canceledAt;
        let { spaceId } = metadata;
        if (cancelAt) {
          cancelAt = cancelAt * 1000;
          canceledAt = new Date(cancelAt);
        }
        return {
          id,
          spaceId,
          cost,
          canceledAt,
          plan,
        };
      } else {
        return {
          id: '',
          spaceId: '',
          cost: '$0/month',
          plan: {
            id: '',
            productId: '',
          },
        };
      }
    },
  );
  let spacePlan = [];

  let spaces = await context.prisma.space.findMany({
    where: {
      property: { landlordUser: { id: context.landlordUserId } },
      stripeSubscriptionId: null,
    },
    include: {
      property: { include: { space: true, location: true } },
    },
  });
  for (let space of spaces) {
    if (space.property) {
      let spaceIndex =
        space.property.space.findIndex(({ id }) => id === space.id) + 1;
      spacePlan.push({
        id: space.id,
        cost: '$0/month',
        space,
        spaceIndex,
        tier: space.tier,
        mainPhoto: space.mainPhoto,
        location: space.property.location,
        plan: {
          id: '',
          productId: '',
        },
      });
    }
  }

  for (let subs of formatedSubsList) {
    let property;
    let id = '';
    let spaceIndex;
    let tier = 'NO_TIER' as LandlordTier;
    let mainPhoto = '';

    if (subs.spaceId) {
      id = subs.spaceId;
      property = await context.prisma.space
        .findOne({ where: { id: subs.spaceId } })
        .property({ include: { location: true, space: true } });
      if (property) {
        spaceIndex = property.space.findIndex(({ id }) => id === subs.spaceId);
        tier = property.space[spaceIndex].tier;
        mainPhoto = property.space[spaceIndex].mainPhoto;
      } else {
        spaceIndex = -1;
      }
    } else {
      property = await context.prisma.space
        .findOne({ where: { stripeSubscriptionId: subs.id } })
        .property({ include: { location: true, space: true } });
      if (property) {
        spaceIndex = property.space.findIndex(
          ({ stripeSubscriptionId }) => stripeSubscriptionId === subs.id,
        );
        tier = property.space[spaceIndex].tier;
        mainPhoto = property.space[spaceIndex].mainPhoto;
        id = property.space[spaceIndex].id;
      } else {
        spaceIndex = -1;
      }
    }
    if (property) {
      spacePlan.push({
        id,
        cost: subs.cost,
        canceledAt: subs.canceledAt,
        spaceIndex: spaceIndex + 1,
        tier,
        mainPhoto,
        location: property.location,
        plan: {
          id: subs.plan.id,
          productId: subs.plan.product,
        },
      });
    }
  }

  return spacePlan;
};

let landlordSubscriptions = queryField('landlordSubscriptions', {
  type: 'SpacePlan',
  resolve: landlordSubscriptionsResolver,
  list: true,
});

export { landlordSubscriptions };
