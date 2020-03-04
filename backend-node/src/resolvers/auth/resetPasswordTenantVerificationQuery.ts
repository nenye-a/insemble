import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

let resetPasswordTenantResolver: FieldResolver<
  'Query',
  'resetPasswordTenantVerification'
> = async (_: Root, { verificationCode }, context: Context) => {
  let tenantRPVerificationId = Base64.decode(verificationCode);
  let tenantRPVerification = await context.prisma.tenantResetPasswordVerification.findOne(
    {
      where: {
        id: tenantRPVerificationId,
      },
      include: {
        user: true,
      },
    },
  );
  if (!tenantRPVerification) {
    throw new Error('Invalid verification code');
  }

  if (tenantRPVerification.verified) {
    throw new Error('Verification code already used.');
  }

  return { message: 'success', verificationId: tenantRPVerification.id };
};

let resetPasswordTenantVerification = queryField(
  'resetPasswordTenantVerification',
  {
    type: 'TenantRegisterResult',
    resolve: resetPasswordTenantResolver,
    args: {
      verificationCode: stringArg({ required: true }),
    },
  },
);

export { resetPasswordTenantVerification };
