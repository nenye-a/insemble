import { mutationField, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';

export let deleteSpaceResolver: FieldResolver<
  'Mutation',
  'deleteSpace'
> = async (_, { spaceId }, context: Context) => {
  let properties = await context.prisma.property.findMany({
    where: {
      space: { some: { id: spaceId } },
    },
    include: {
      landlordUser: true,
    },
  });

  if (!properties.length) {
    throw new Error('Property not found!');
  }

  if (properties[0].landlordUser.id !== context.landlordUserId) {
    throw new Error('User not authorized to create new space');
  }
  let deletedSpace = await context.prisma.space.delete({
    where: {
      id: spaceId,
    },
  });

  return deletedSpace.id;
};

export let deleteSpace = mutationField('deleteSpace', {
  type: 'String',
  args: {
    spaceId: stringArg({ required: true }),
  },
  resolve: deleteSpaceResolver,
});
