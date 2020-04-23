import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';
import { MatchingLocation } from 'dataTypes';
import { trialCheck } from '../../helpers/trialCheck';

let brandsResolver: FieldResolver<'Query', 'brands'> = async (
  _: Root,
  _args,
  context: Context,
) => {
  let tenantUser = await context.prisma.tenantUser.findOne({
    where: {
      id: context.tenantUserId,
    },
  });
  if (!tenantUser) {
    throw new Error('User not found');
  }
  let isTrial = trialCheck(tenantUser.createdAt);
  if (!isTrial) {
    if (tenantUser.tier !== 'FREE' && tenantUser.stripeSubscriptionId) {
      tenantUser = await context.prisma.tenantUser.update({
        where: { id: tenantUser.id },
        data: { tier: 'FREE' },
      });
    }
  }
  let brands = await context.prisma.brand.findMany({
    select: {
      id: true,
      name: true,
      categories: true,
      matchingLocations: true,
      nextLocations: true,
      locationCount: true,
      newLocationPlan: true,
      location: true,
    },
    orderBy: { id: 'desc' },
    where: {
      tenantUser: {
        id: context.tenantUserId,
      },
    },
  });

  return brands.map((brand) => {
    let existMatchingLocations: Array<MatchingLocation> = brand.matchingLocations
      ? JSON.parse(brand.matchingLocations)
      : [];
    return { ...brand, matchingLocations: existMatchingLocations };
  });
};

let brands = queryField('brands', {
  type: 'BrandThumbnail',
  resolve: brandsResolver,
  list: true,
});

export { brands };
