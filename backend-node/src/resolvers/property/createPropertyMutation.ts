import { mutationField, arg, FieldResolver } from 'nexus';

import { Context } from 'serverTypes';

export let createPropertyResolver: FieldResolver<
  'Mutation',
  'createProperty'
> = async (_, { property, space }, context: Context) => {
  let {
    businessType = [],
    propertyType = [],
    categories = [],
    exclusive = [],
    location,
    ...propertyInput
  } = property;
  let { equipment = [], photos = [], available, ...spaceInput } = space || {};
  let newProperty = await context.prisma.property.create({
    data: {
      ...propertyInput,
      location: {
        create: location,
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
        create: {
          ...spaceInput,
          equipment: {
            set: equipment,
          },
          photos: {
            set: photos,
          },
          available: new Date(available),
        },
      },
      landlordUser: {
        connect: {
          id: context.landlordUserId,
        },
      },
    },
  });
  return newProperty.id;
};

export let createProperty = mutationField('createProperty', {
  type: 'String',
  args: {
    property: arg({ type: 'PropertyInput', required: true }),
    space: arg({ type: 'SpaceInput', required: true }),
  },
  resolve: createPropertyResolver,
});
