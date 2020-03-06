import { mutationField, FieldResolver, stringArg } from 'nexus';
import { Base64 } from 'js-base64';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';

let resetPasswordTenantResolver: FieldResolver<
  'Mutation',
  'resetPasswordTenant'
> = async (_, { verificationCode, password }, context: Context) => {
  let [verifyId, tokenQuery] = verificationCode
    ? verificationCode.split(':')
    : [];
  if (!verifyId || !tokenQuery) {
    throw new Error('Invalid verification code');
  }
  let tenantRPVerificationId = Base64.decode(verifyId);
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

  if (tokenQuery !== tenantRPVerification.tokenQuery) {
    throw new Error('Invalid token');
  }

  let targetUser = await context.prisma.tenantUser.findOne({
    where: { id: tenantRPVerification.user.id },
  });

  if (!targetUser) {
    throw new Error('User not found!');
  }
  let cryptedPassword = bcrypt.hashSync(password, 10);
  await context.prisma.tenantUser.update({
    data: {
      password: cryptedPassword,
    },
    where: {
      id: targetUser.id,
    },
  });
  await context.prisma.tenantResetPasswordVerification.update({
    data: {
      verified: true,
    },
    where: {
      id: tenantRPVerification.id,
    },
  });

  return {
    message: 'success',
    verificationId:
      Base64.encodeURI(tenantRPVerification.id) +
      ':' +
      tenantRPVerification.tokenQuery,
  };
};

export let resetPasswordTenant = mutationField('resetPasswordTenant', {
  type: 'TenantRegisterResult',
  args: {
    password: stringArg({ required: true }),
    verificationCode: stringArg({ required: true }),
  },
  resolve: resetPasswordTenantResolver,
});
