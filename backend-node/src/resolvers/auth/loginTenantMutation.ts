import { mutationField, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';
import { trialCheck } from '../../helpers/trialCheck';

let loginTenant = mutationField('loginTenant', {
  type: 'TenantAuth',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  resolve: async (_: Root, { email, password }, context: Context) => {
    let lowercasedEmail = email.toLowerCase();
    let tenantUser = await context.prisma.tenantUser.findOne({
      where: {
        email: lowercasedEmail,
      },
      include: {
        brands: true,
      },
    });
    if (!tenantUser) {
      throw new Error('Email not found or wrong password');
    }
    let brandId = tenantUser.brands.length ? tenantUser.brands[0].id : '';
    let validPassword = bcrypt.compareSync(password, tenantUser.password);
    if (!validPassword) {
      throw new Error('Email not found or wrong password');
    }
    let isTrial = trialCheck(tenantUser.createdAt);
    if (!isTrial) {
      if (tenantUser.tier !== 'FREE' && !tenantUser.stripeSubscriptionId) {
        await context.prisma.tenantUser.update({
          where: { id: context.tenantUserId },
          data: { tier: 'FREE' },
        });
      }
    }
    return {
      token: createSession(tenantUser, 'TENANT'),
      tenant: { ...tenantUser, trial: isTrial },
      brandId: brandId || '',
    };
  },
});

export { loginTenant };
