import { queryField, FieldResolver, idArg } from 'nexus';
import { Context } from 'serverTypes';

let spaceResolver: FieldResolver<'Query', 'space'> = async (
  _,
  { spaceId },
  { prisma }: Context,
) => {
  let space = await prisma.space.findOne({
    where: {
      id: spaceId,
    },
  });
  if (!space) {
    throw new Error('Invalid space Id');
  }
  return space;
};

let space = queryField('space', {
  type: 'Space',
  resolve: spaceResolver,
  args: {
    spaceId: idArg({ required: true }),
  },
});

export { space };
