import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

let resetPasswordTenantResolver: FieldResolver<
  'Query',
  'resetPasswordTenantVerification'
> = async (_: Root, { verificationCode }, context: Context) => {
  let [verifyId, tokenEmail] = verificationCode
    ? verificationCode.split(':')
    : [];
  if (!verifyId || !tokenEmail) {
    throw new Error('Invalid verification code');
  }
  let tenantRPVerificationId = Base64.decode(verifyId);
  let decodedTokenEmail = Base64.decode(tokenEmail);
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

  if (decodedTokenEmail !== tenantRPVerification.tokenEmail) {
    throw new Error('Invalid token');
  }

  return {
    message: 'success',
    verificationId:
      Base64.encodeURI(tenantRPVerification.id) +
      ':' +
      tenantRPVerification.tokenQuery,
  };
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
