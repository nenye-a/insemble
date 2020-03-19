import {
  mutationField,
  FieldResolver,
  stringArg,
  floatArg,
  intArg,
} from 'nexus';

import { Context } from 'serverTypes';

export let savePropertyResolver: FieldResolver<
  'Mutation',
  'saveProperty'
> = async (_, args, context: Context) => {
  return await context.prisma.savedProperty.create({
    data: {
      tenantUser: {
        connect: {
          id: context.tenantUserId,
        },
      },
      ...args,
    },
  });
};

export let saveProperty = mutationField('saveProperty', {
  type: 'SavedProperty',
  args: {
    spaceId: stringArg({ required: true }),
    address: stringArg({ required: true }),
    thumbnail: stringArg({ required: true }),
    matchValue: floatArg({ required: true }),
    rent: intArg({ nullable: true }),
    sqft: intArg({ required: true }),
  },
  resolve: savePropertyResolver,
});
