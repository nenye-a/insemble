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
  let selectedBrand = await context.prisma.brand.findOne({
    where: { id: brandId },
    include: { tenantUser: { include: { brands: true } } },
  });
  if (!selectedBrand) {
    throw new Error('Brand not found');
  }
  let tenantUser = selectedBrand.tenantUser;
  if (!tenantUser) {
    throw new Error('Brand not connected to tenant.');
  }
  if (tenantUser.id !== context.tenantUserId) {
    throw new Error('This is not your brand. Not authorized.');
  }
  if (tenantUser.tier === 'FREE') {
    let latestBrandIndex = tenantUser.brands.length - 1;
    let selectedBrandIndex = tenantUser.brands.findIndex(
      ({ id }) => id === brandId,
    );
    if (latestBrandIndex !== selectedBrandIndex) {
      throw new Error(
        'Free tier can only edit latest brand. Upgrade to professional if you want to update.',
      );
    }
  }

  let { education = [], commute = [], ethnicity = [], ...filterInput } =
    filter || {};
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

  let { nextLocations, ...businessInput } = business || {};

  if (nextLocations) {
    await context.prisma.brand.update({
      data: {
        nextLocations: {
          deleteMany: { NOT: { id: '0' } },
        },
      },
      where: {
        id: brandId,
      },
    });
  }
  let pendingUpdateData = {
    ...businessInput,
    ...filterInput,
    nextLocations: nextLocations,
    education: educationRaw,
    commute: commuteRaw,
    ethnicity: ethnicityRaw,
  };

  let brand = await context.prisma.brand.update({
    data: {
      pendingUpdate: JSON.stringify(pendingUpdateData),
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
