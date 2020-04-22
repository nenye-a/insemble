import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';
import { trialCheck } from '../../helpers/trialCheck';

let profileLandlordResolver: FieldResolver<'Query', 'profileLandlord'> = async (
  _: Root,
  _args,
  context: Context,
) => {
  let landlord = await context.prisma.landlordUser.findOne({
    where: {
      id: context.landlordUserId,
    },
    include: { properties: { include: { space: true } } },
  });
  if (!landlord) {
    throw new Error('user not found');
  }
  let isTrial = trialCheck(landlord.createdAt);
  if (!isTrial) {
    if (
      landlord.properties.some(({ space }) =>
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
              id: landlord.id,
            },
          },
        },
        data: {
          tier: 'NO_TIER',
        },
      });
    }
  }
  return { ...landlord, trial: isTrial };
};

let profileLandlord = queryField('profileLandlord', {
  type: 'LandlordUser',
  resolve: profileLandlordResolver,
});

export { profileLandlord };
