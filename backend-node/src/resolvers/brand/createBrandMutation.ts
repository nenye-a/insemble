import { mutationField, arg, FieldResolver } from 'nexus';
import axios from 'axios';

import { LEGACY_API_URI } from '../../constants/host';
import { Context } from 'serverTypes';
import { FilterOptions } from 'dataTypes';
import { trialCheck } from '../../helpers/trialCheck';

export let createBrandResolver: FieldResolver<
  'Mutation',
  'createBrand'
> = async (_, { business, filter }, context: Context) => {
  let tenantUser = await context.prisma.tenantUser.findOne({
    where: {
      id: context.tenantUserId,
    },
    include: { brands: true },
  });
  if (!tenantUser) {
    throw new Error('User not found');
  }
  let isTrial = trialCheck(tenantUser.createdAt);
  if (!isTrial) {
    if (tenantUser.tier !== 'FREE' && !tenantUser.stripeSubscriptionId) {
      tenantUser = await context.prisma.tenantUser.update({
        where: { id: tenantUser.id },
        data: { tier: 'FREE' },
        include: { brands: true },
      });
    }
  }
  if (tenantUser.tier === 'FREE' && tenantUser.brands.length > 1) {
    throw new Error(
      'Can not create new brand. Please upgrade to pro to make new brand.',
    );
  }
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
