import { mutationField, arg, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';

export let editSpaceResolver: FieldResolver<'Mutation', 'editSpace'> = async (
  _,
  { space, spaceId },
  context: Context,
) => {
  let { equipment = [], photos = [], available, ...spaceInput } = space || {};
  let updatedSpace = await context.prisma.space.update({
    data: {
      ...spaceInput,
      equipment: {
        set: equipment,
      },
      photos: {
        set: photos,
      },
      available: new Date(available),
    },
    where: {
      id: spaceId,
    },
  });

  return updatedSpace.id;
};

export let editSpace = mutationField('editSpace', {
  type: 'String',
  args: {
    space: arg({ type: 'SpaceInput', required: true }),
    spaceId: stringArg({ required: true }),
  },
  resolve: editSpaceResolver,
});
