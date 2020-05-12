import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';
import { trialCheck } from '../../helpers/trialCheck';

let propertiesResolver: FieldResolver<'Query', 'properties'> = async (
  _: Root,
  _args,
  context: Context,
) => {
  let landlordUser = await context.prisma.landlordUser.findOne({
    where: {
      id: context.landlordUserId,
    },
    include: {
      properties: { include: { space: { orderBy: { createdAt: 'asc' } } } },
    },
  });
  if (!landlordUser) {
    throw new Error('User not found');
  }
  let isTrial = trialCheck(landlordUser.createdAt);
  if (!isTrial) {
    if (
      landlordUser.properties.some(({ space }) =>
        space.some(
          ({ stripeSubscriptionId, tier }) =>
            !stripeSubscriptionId && tier !== 'NO_TIER',
        ),
      )
    ) {
      await context.prisma.space.updateMany({
        where: {
          stripeSubscriptionId: null,
          property: {
            landlordUser: {
              id: landlordUser.id,
            },
          },
        },
        data: {
          tier: 'NO_TIER',
        },
      });
    }
  }
  let properties = await context.prisma.property.findMany({
    orderBy: { id: 'desc' },
    include: {
      space: { orderBy: { createdAt: 'asc' } },
    },
    where: {
      landlordUser: {
        id: context.landlordUserId,
      },
    },
  });
  return properties.map((property) => {
    let { space, ...restProperty } = property;
    let stringDateSpace = space.map((sp) => {
      let { available, ...restSpace } = sp;
      return { ...restSpace, available: available.toString() };
    });
    let isHaveProSpace = property.space.some(
      ({ tier }) => tier === 'PROFESSIONAL',
    );
    let isHaveBasicSpace = property.space.some(({ tier }) => tier === 'BASIC');
    return {
      ...restProperty,
      space: stringDateSpace,
      locked: !isHaveBasicSpace && !isHaveProSpace,
    };
  });
};

let properties = queryField('properties', {
  type: 'PropertyThumbnail',
  resolve: propertiesResolver,
  list: true,
});

export { properties };
