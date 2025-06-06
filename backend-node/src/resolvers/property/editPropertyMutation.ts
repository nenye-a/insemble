import { mutationField, arg, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';

export let editPropertyResolver: FieldResolver<
  'Mutation',
  'editProperty'
> = async (_, { property, propertyId }, context: Context) => {
  let existingProperty = await context.prisma.property.findOne({
    where: {
      id: propertyId,
    },
    include: {
      landlordUser: true,
    },
  });

  if (!existingProperty) {
    throw new Error('Property not found!');
  }

  if (existingProperty.landlordUser.id !== context.landlordUserId) {
    throw new Error('User not authorized to edit property');
  }

  let {
    businessType = [],
    exclusive = [],
    userRelations = [],
    location,
    ...propertyInput
  } = property;
  let updatedProperty = await context.prisma.property.update({
    data: {
      ...propertyInput,
      location: {
        update: location,
      },
      exclusive: {
        set: exclusive,
      },
      businessType: {
        set: businessType,
      },
      userRelations: {
        set: userRelations,
      },
      userRelation: '', //TODO: remove this after userRelation successfully migrated
      space: {
        updateMany: {
          where: { matchingBrand: { not: '0' } },
          data: {
            matchingBrand: null,
          },
        },
      },
    },
    where: {
      id: propertyId,
    },
  });

  return updatedProperty.id;
};

export let editProperty = mutationField('editProperty', {
  type: 'String',
  args: {
    property: arg({ type: 'PropertyInput', required: true }),
    propertyId: stringArg({ required: true }),
  },
  resolve: editPropertyResolver,
});
