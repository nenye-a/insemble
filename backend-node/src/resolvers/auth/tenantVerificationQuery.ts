import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';

let tenantVerificationResolver: FieldResolver<
  'Query',
  'tenantRegisterVerification'
> = async (_: Root, { verificationId }, context: Context) => {
  let [verifyId, tokenQuery] = verificationId ? verificationId.split(':') : [];
  if (!verifyId || !tokenQuery) {
    throw new Error('Invalid verification code');
  }
  let tenantVerificationId = Base64.decode(verifyId);
  let tenantTokenQuery = Base64.decode(tokenQuery);
  let tenantVerification = await context.prisma.tenantRegisterVerification.findOne(
    {
      where: {
        id: tenantVerificationId,
      },
    },
  );
  if (!tenantVerification) {
    throw new Error('Invalid verification ID');
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

  if (tenantTokenQuery !== tenantVerification.tokenQuery) {
    throw new Error('Invalid token');
  }

  let brandId = tenantUser.brands.length ? tenantUser.brands[0].id : '';

  return {
    ...tenantVerification,
    tenantAuth: {
      token: createSession(tenantUser, 'TENANT'),
      tenant: tenantUser,
      brandId: brandId || '',
    },
  };
};

let tenantVerification = queryField('tenantRegisterVerification', {
  type: 'TenantRegisterVerification',
  args: {
    verificationId: stringArg({
      // TODO: fix naming args
      required: true,
    }),
  },
  resolve: tenantVerificationResolver,
});

export { tenantVerification };
