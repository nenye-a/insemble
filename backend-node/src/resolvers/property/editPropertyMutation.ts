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
    propertyType = [],
    categories = [],
    exclusive = [],
    location,
    ...propertyInput
  } = property;
  let updatedProperty = await context.prisma.property.update({
    data: {
      ...propertyInput,
      location: {
        update: location,
      },
      categories: {
        set: categories,
      },
      exclusive: {
        set: exclusive,
      },
      businessType: {
        set: businessType,
      },
      propertyType: {
        set: propertyType,
      },
      space: {
        updateMany: {
          where: { matchingBrand: { not: { equals: '0' } } },
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
