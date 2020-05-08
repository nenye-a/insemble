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
    if (tenantUser.tier !== 'FREE' && !tenantUser.stripeSubscriptionId) {
      tenantUser = await context.prisma.tenantUser.update({
        where: { id: tenantUser.id },
        data: { tier: 'FREE' },
      });
      if (!tenantUser) {
        throw new Error('Update user tier failed.');
      }
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
  let isFreeUser = tenantUser.tier === 'FREE';
  return brands.map((brand, index) => {
    let existMatchingLocations: Array<MatchingLocation> = brand.matchingLocations
      ? JSON.parse(brand.matchingLocations)
      : [];
    let locked = false;
    if (isFreeUser) {
      locked = index !== 0;
    } // NOTE: because orderBy desc the latest should be in the index 0
    return { ...brand, matchingLocations: existMatchingLocations, locked };
  });
};

let brands = queryField('brands', {
  type: 'BrandThumbnail',
  resolve: brandsResolver,
  list: true,
});

export { brands };
