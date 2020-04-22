import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';
import { trialCheck } from '../../helpers/trialCheck';

let profileTenantResolver: FieldResolver<'Query', 'profileTenant'> = async (
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
  let isTrial = trialCheck(tenant.createdAt);
  if (!isTrial) {
    if (tenant.tier !== 'FREE' && !tenant.stripeSubscriptionId) {
      tenant = await context.prisma.tenantUser.update({
        where: { id: context.tenantUserId },
        data: { tier: 'FREE' },
      });
    }
  }
  return { ...tenant, trial: isTrial };
};

let profileTenant = queryField('profileTenant', {
  type: 'TenantUser',
  resolve: profileTenantResolver,
});

export { profileTenant };
