import { queryField, FieldResolver } from 'nexus';

import { Context } from 'serverTypes';

export let savedPropertiesResolver: FieldResolver<
  'Query',
  'savedProperties'
> = async (_, __, context: Context) => {
  let savedProperties = await context.prisma.savedProperty.findMany({
    where: {
      tenantUser: {
        id: context.tenantUserId,
      },
    },
  });
  let spaceIds = savedProperties.map(({ spaceId }) => spaceId);
  let spacesMap = new Map(
    (
      await context.prisma.space.findMany({
        where: {
          spaceId: { in: spaceIds },
        },
        include: {
          property: {
            include: {
              location: true,
            },
          },
        },
      })
    ).map((space) => {
      return [space.spaceId, space];
    }),
  );
  return savedProperties.map((savedProperty) => {
    let space = spacesMap.get(savedProperty.spaceId);
    if (!space) {
      throw new Error('Space not found');
    }
    return {
      ...savedProperty,
      address: space.property?.location.address || '',
      rent: space.pricePerSqft,
      sqft: space.sqft,
      thumbnail: space.mainPhoto,
    };
  });
};

export let savedProperties = queryField('savedProperties', {
  type: 'SavedProperty',
  list: true,
  resolve: savedPropertiesResolver,
});
