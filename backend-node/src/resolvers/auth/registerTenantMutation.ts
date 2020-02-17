import { mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';
import { createTenantSession } from '../../helpers/auth';

export let registerTenant = mutationField('registerTenant', {
  type: 'TenantAuth',
  args: {
    tenant: arg({ type: 'TenantRegisterInput', required: true }),
  },
  resolve: async (_, { tenant }, context: Context) => {
    let password = bcrypt.hashSync(tenant.password, 10);
    let lowerCasedEmail = tenant.email.toLocaleLowerCase();
    let exist = await context.prisma.tenantUser.findMany({
      where: {
        email: lowerCasedEmail,
      },
    });
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
    return {
      token: createTenantSession(createdTenant),
      tenant: createdTenant,
    };
  },
});
