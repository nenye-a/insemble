import { mutationField, arg, FieldResolver } from 'nexus';

import { Context } from 'serverTypes';

export let createBrandResolver: FieldResolver<
  'Mutation',
  'createBrand'
> = async (_, { business, filter }, context: Context) => {
  let {
    categories = [],
    equipmentIds = [],
    personas = [],
    spaceType = [],
    education = [],
    commute = [],
    ...filterInput
  } = filter || {};
  let { location, nextLocations, ...businessInput } = business || {};
  let brand = await context.prisma.brand.create({
    data: {
      ...businessInput,
      ...filterInput,
      categories: {
        set: categories,
      },
      equipmentIds: {
        set: equipmentIds,
      },
      personas: {
        set: personas,
      },
      spaceType: {
        set: spaceType,
      },
      education: {
        set: education,
      },
      commute: {
        set: commute,
      },
      location: {
        create: location,
      },
      tenantUser: {
        connect: {
          id: context.tenantUserId,
        },
      },
    },
  });
  return brand.id;
};

export let createBrand = mutationField('createBrand', {
  type: 'String',
  args: {
    business: arg({ type: 'BusinessInput' }),
    filter: arg({ type: 'FilterInput' }),
  },
  resolve: createBrandResolver,
});
