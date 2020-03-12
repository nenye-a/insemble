import { mutationField, FieldResolver, stringArg } from 'nexus';
import axios from 'axios';
import { LEGACY_API_URI } from '../../constants/host';
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

  let pyPropertyId = properties[0].propertyId;

  let existingSpace = await context.prisma.space.findOne({
    where: { id: spaceId },
  });

  if (!existingSpace) {
    throw new Error('Cannot find space');
  }

  let pySpaceId = existingSpace.spaceId;

  if (pySpaceId && pyPropertyId) {
    let resultStatus = (
      await axios.delete(
        `${LEGACY_API_URI}/api/propertyTenants/${pyPropertyId}/${pySpaceId}/`,
      )
    ).status;
    if (resultStatus !== 304 && resultStatus !== 200) {
      throw new Error('Cannot delete space!');
    }
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
