import { mutationField, arg, FieldResolver, stringArg } from 'nexus';
import axios from 'axios';

import { LEGACY_API_URI } from '../../constants/host';
import { Context } from 'serverTypes';
import { FilterOptions } from 'dataTypes';

export let editBrandResolver: FieldResolver<'Mutation', 'editBrand'> = async (
  _,
  { business, filter, brandId },
  context: Context,
) => {
  let {
    categories = [],
    equipment = [],
    personas = [],
    spaceType = [],
    education = [],
    commute = [],
    ethnicity = [],
    ...filterInput
  } = filter || {};
  let {
    ethnicity: ethnicityOpt,
    commute: commuteOpt,
    education: educationOpt,
  }: FilterOptions = (await axios.get(`${LEGACY_API_URI}/api/filter/`)).data;

  let ethnicityRaw = ethnicity?.map((str) => {
    return ethnicityOpt.find((strOptRaw) => strOptRaw.includes(str)) || '';
  });

  let commuteRaw = commute?.map((str) => {
    return commuteOpt.find((strOptRaw) => strOptRaw.includes(str)) || '';
  });

  let educationRaw = education?.map((str) => {
    return educationOpt.find((strOptRaw) => strOptRaw.includes(str)) || '';
  });

  let { location, nextLocations, ...businessInput } = business || {};
  let brand = await context.prisma.brand.update({
    data: {
      ...businessInput,
      ...filterInput,
      nextLocations: {
        create: nextLocations,
      },
      categories: {
        set: categories,
      },
      equipment: {
        set: equipment,
      },
      personas: {
        set: personas,
      },
      spaceType: {
        set: spaceType,
      },
      education: {
        set: educationRaw,
      },
      commute: {
        set: commuteRaw,
      },
      ethnicity: {
        set: ethnicityRaw,
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
