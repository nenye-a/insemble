import { mutationField, arg, FieldResolver } from 'nexus';
import axios from 'axios';

import { LEGACY_API_URI } from '../../constants/host';
import { Context } from 'serverTypes';
import { FilterOptions } from 'dataTypes';

export let createBrandResolver: FieldResolver<
  'Mutation',
  'createBrand'
> = async (_, { business, filter }, context: Context) => {
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

  let { minIncome, maxIncome, minAge, maxAge, maxRent, minRent } = filter || {};
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
  let brand = await context.prisma.brand.create({
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
      tenantUser: {
        connect: {
          id: context.tenantUserId,
        },
      },
    },
  });

  if (
    !(name && location) &&
    !(categories && categories.length > 0 && minIncome)
  ) {
    throw new Error(
      'Please update your brand and provide either (address and brand_name) or (categories and income)',
    );
  }

  axios.get(`${LEGACY_API_URI}/api/tenantMatches`, {
    params: {
      brand_id: brand.id,
      address: location?.address,
      brand_name: name,
      categories:
        categories && categories.length > 0
          ? JSON.stringify(categories)
          : undefined,
      income: minIncome && {
        min: minIncome,
        max: maxIncome,
      },
      age: minAge && {
        min: minAge,
        max: maxAge,
      },
      personas:
        personas && personas.length > 0 ? JSON.stringify(personas) : undefined,
      commute:
        commuteRaw && commuteRaw.length > 0
          ? JSON.stringify(commute)
          : undefined,
      education:
        educationRaw && educationRaw.length > 0
          ? JSON.stringify(education)
          : undefined,
      rent: minRent && {
        min: minRent,
        max: maxRent,
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
