import { mutationField, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';

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
    let brandId = tenantUser.brands[0].id;
    let validPassword = bcrypt.compareSync(password, tenantUser.password);
    if (!validPassword) {
      throw new Error('Email not found or wrong password');
    }
    return {
      token: createSession(tenantUser, 'TENANT'),
      tenant: tenantUser,
      brandId: brandId || '', //TODO: temporary solution for login, we need to replace this with getting latest brandId
    };
  },
});

export { loginTenant };
