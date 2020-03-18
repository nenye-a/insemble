import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';
import { MatchingLocation } from 'dataTypes';

let brandsResolver: FieldResolver<'Query', 'brands'> = async (
  _: Root,
  _args,
  context: Context,
) => {
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
