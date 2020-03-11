import { FieldResolver, stringArg, mutationField } from 'nexus';

import { Root, Context } from 'serverTypes';

let deletePropertyResolver: FieldResolver<
  'Mutation',
  'deleteProperty'
> = async (_: Root, { propertyId }, context: Context) => {
  let property = await context.prisma.property.findOne({
    where: {
      id: propertyId,
    },
    include: {
      landlordUser: true,
    },
  });
  if (!property) {
    throw new Error('Property not found!');
  }
  if (property.landlordUser.id !== context.landlordUserId) {
    throw new Error('User not authorized to delete');
  }
  await context.prisma.property.delete({
    where: {
      id: propertyId,
    },
  });
  return 'success';
};

let deleteProperty = mutationField('deleteProperty', {
  type: 'String',
  resolve: deletePropertyResolver,
  args: { propertyId: stringArg({ required: true }) },
});

export { deleteProperty };
