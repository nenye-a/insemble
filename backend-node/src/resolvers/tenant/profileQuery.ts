import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';

let profileResolver: FieldResolver<'Query', 'profileTenant'> = async (
  _: Root,
  _args,
  context: Context,
) => {
  let tenant = await context.prisma.tenantUser.findOne({
    where: {
      id: context.tenantUserId,
    },
  });
  if (!tenant) {
    throw new Error('user not found');
  }
  return tenant;
};

let profile = queryField('profileTenant', {
  type: 'TenantUser',
  resolve: profileResolver,
});

export { profile };
