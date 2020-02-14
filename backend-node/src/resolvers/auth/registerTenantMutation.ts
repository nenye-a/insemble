import { mutationField, arg } from 'nexus';
import { Context } from 'serverTypes';
import bcrypt from 'bcrypt';

export let registerTenant = mutationField('registerTenant', {
  type: 'TenantAuth',
  args: {
    tenant: arg({ type: 'TenantRegisterInput', required: true }),
  },
  resolve: async (_, { tenant }, context: Context) => {
    let password = bcrypt.hashSync(tenant.password, 10);
    let exist = await context.prisma.tenantUser.findMany({
      where: {
        email: tenant.email,
      },
    });
    if (exist) {
      throw new Error('user already exist');
    }
    let createdTenant = await context.prisma.tenantUser.create({
      data: {
        ...tenant,
        password,
        tier: 'FREE',
      },
    });
    return {
      token: 'put token here',
      tenant: createdTenant,
    };
  },
});
