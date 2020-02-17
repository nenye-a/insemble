import { mutationField, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { createTenantSession } from '../../helpers/auth';

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
    });
    if (!tenantUser) {
      throw new Error('Email not found or wrong password');
    }
    let validPassword = bcrypt.compareSync(password, tenantUser.password);
    if (!validPassword) {
      throw new Error('Email not found or wrong password');
    }
    return {
      token: createTenantSession(tenantUser),
      tenant: tenantUser,
    };
  },
});

export { loginTenant };
