import { FieldResolver, stringArg, mutationField } from 'nexus';
import axios from 'axios';
import { LEGACY_API_URI } from '../../constants/host';

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
      space: true,
    },
  });
  if (!property) {
    throw new Error('Property not found!');
  }
  if (property.landlordUser.id !== context.landlordUserId) {
    throw new Error('User not authorized to delete');
  }

  let pyPropertyId = property.propertyId;

  if (pyPropertyId) {
    let resultStatus = (
      await axios.delete(
        `${LEGACY_API_URI}/api/propertyTenants/${pyPropertyId}`,
      )
    ).status;
    if (resultStatus !== 304 && resultStatus !== 200) {
      throw new Error('Cannot delete property!');
    }
  }
  let spaces = property.space;
  for (let space of spaces) {
    await context.prisma.conversation.deleteMany({
      where: { space: { id: space.id } },
    });
    await context.prisma.space.delete({
      where: {
        id: space.id,
      },
    });
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
