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
      properties: { include: { space: true } },
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
      space: true,
    },
    where: {
      landlordUser: {
        id: context.landlordUserId,
      },
    },
  });
  // TODO: Just return properties, should be work and adjust it with FE.
  return properties.map((property) => {
    let { space, ...restProperty } = property;
    let stringDateSpace = space.map((sp) => {
      let { available, ...restSpace } = sp;
      return { ...restSpace, available: available.toString() };
    });
    return { ...restProperty, space: stringDateSpace };
  });
};

let properties = queryField('properties', {
  type: 'PropertyThumbnail',
  resolve: propertiesResolver,
  list: true,
});

export { properties };
