import { queryField, FieldResolver } from 'nexus';

import { Context } from 'serverTypes';

export let savedPropertiesResolver: FieldResolver<
  'Query',
  'savedProperties'
> = async (_, __, context: Context) => {
  return await context.prisma.savedProperty.findMany({
    where: {
      tenantUser: {
        id: context.tenantUserId,
      },
    },
  });
};

export let savedProperties = queryField('savedProperties', {
  type: 'SavedProperty',
  list: true,
  resolve: savedPropertiesResolver,
});
