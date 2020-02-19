import { mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';
import { createTenantSession } from '../../helpers/auth';
import { createBrandResolver } from '../brand/createBrandMutation';

export let registerTenant = mutationField('registerTenant', {
  type: 'TenantAuth',
  args: {
    tenant: arg({ type: 'TenantRegisterInput', required: true }),
    business: arg({ type: 'BusinessInput' }),
    filter: arg({ type: 'FilterInput' }),
  },
  resolve: async (_, { tenant, business, filter }, context: Context, info) => {
    let password = bcrypt.hashSync(tenant.password, 10);
    let lowerCasedEmail = tenant.email.toLocaleLowerCase();
    let exist = await context.prisma.tenantUser.findMany({
      where: {
        email: lowerCasedEmail,
      },
    });
    let brandId = '';
    if (exist.length) {
      throw new Error('user already exist');
    }
    let createdTenant = await context.prisma.tenantUser.create({
      data: {
        ...tenant,
        email: lowerCasedEmail,
        password,
        tier: 'FREE',
      },
    });
    if (business || filter) {
      brandId = await createBrandResolver(
        {},
        { business, filter },
        { ...context, tenantUserId: createdTenant.id },
        info,
      );
    }
    return {
      token: createTenantSession(createdTenant),
      tenant: createdTenant,
      brandId,
    };
  },
});
