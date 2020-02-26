import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';

let profileLandlordResolver: FieldResolver<'Query', 'profileLandlord'> = async (
  _: Root,
  _args,
  context: Context,
) => {
  let landlord = await context.prisma.landlordUser.findOne({
    where: {
      id: context.landlordUserId,
    },
  });
  if (!landlord) {
    throw new Error('user not found');
  }
  return landlord;
};

let profileLandlord = queryField('profileLandlord', {
  type: 'LandlordUser',
  resolve: profileLandlordResolver,
});

export { profileLandlord };
