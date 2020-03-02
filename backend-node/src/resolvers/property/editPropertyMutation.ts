import { mutationField, arg, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';

export let editPropertyResolver: FieldResolver<
  'Mutation',
  'editProperty'
> = async (_, { property, propertyId }, context: Context) => {
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
