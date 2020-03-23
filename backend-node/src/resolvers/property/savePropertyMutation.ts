import { mutationField, FieldResolver, stringArg, floatArg } from 'nexus';

import { Context } from 'serverTypes';

export let savePropertyResolver: FieldResolver<
  'Mutation',
  'saveProperty'
> = async (_, { spaceId, matchValue }, context: Context) => {
  let space = await context.prisma.space.findOne({
    where: {
      spaceId: spaceId,
    },
    include: {
      property: {
        include: {
          location: true,
        },
      },
    },
  });
  if (!space) {
    throw new Error('space not found');
  }
  let savedProperty = await context.prisma.savedProperty.create({
    data: {
      tenantUser: {
        connect: {
          id: context.tenantUserId,
        },
      },
      spaceId,
      matchValue,
    },
  });

  return {
    ...savedProperty,
    address: space.property?.location.address || '',
    rent: space.pricePerSqft,
    sqft: space.sqft,
    thumbnail: space.mainPhoto,
  };
};

export let saveProperty = mutationField('saveProperty', {
  type: 'SavedProperty',
  args: {
    spaceId: stringArg({ required: true }),
    matchValue: floatArg({ required: true }),
  },
  resolve: savePropertyResolver,
});
