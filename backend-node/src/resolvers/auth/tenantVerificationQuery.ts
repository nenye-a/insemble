import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';

let tenantVerificationResolver: FieldResolver<
  'Query',
  'tenantVerification'
> = async (_: Root, { verificationId }, context: Context) => {
  let tenantVerification = await context.prisma.tenantVerification.findOne({
    where: {
      id: verificationId,
    },
  });
  if (!tenantVerification) {
    throw new Error('verification Id not found');
  }
  let tenantUser = await context.prisma.tenantUser.findOne({
    where: {
      email: tenantVerification.email,
    },
    include: {
      brands: true,
    },
  });
  if (!tenantUser) {
    throw new Error('User not found');
  }
  let brandId = tenantUser.brands[0].id;

  return {
    ...tenantVerification,
    tenantAuth: {
      token: createSession(tenantUser, 'TENANT'),
      tenant: tenantUser,
      brandId: brandId || '',
    },
  };
};

let tenantVerification = queryField('tenantVerification', {
  type: 'TenantVerification',
  args: {
    verificationId: stringArg({
      required: true,
    }),
  },
  resolve: tenantVerificationResolver,
});

export { tenantVerification };
