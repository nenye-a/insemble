import { mutationField, arg, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';

export let editBrandResolver: FieldResolver<'Mutation', 'editBrand'> = async (
  _,
  { business, filter, brandId },
  context: Context,
) => {
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
  let brand = await context.prisma.brand.update({
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
      matchingLocations: null,
      matchingProperties: {
        set: [],
      },
    },
    where: {
      id: brandId,
    },
  });

  return brand.id;
};

export let editBrand = mutationField('editBrand', {
  type: 'String',
  args: {
    business: arg({ type: 'BusinessInput' }),
    filter: arg({ type: 'FilterInput' }),
    brandId: stringArg({ required: true }),
  },
  resolve: editBrandResolver,
});
