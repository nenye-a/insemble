import { mutationField, FieldResolver, stringArg } from 'nexus';
import { Base64 } from 'js-base64';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';

let resetPasswordLandlordResolver: FieldResolver<
  'Mutation',
  'resetPasswordLandlord'
> = async (_, { verificationCode, password }, context: Context) => {
  let [verifyId, tokenQuery] = verificationCode
    ? verificationCode.split(':')
    : [];
  if (!verifyId || !tokenQuery) {
    throw new Error('Invalid verification code');
  }
  let landlordRPVerificationId = Base64.decode(verifyId);
  let landlordRPVerification = await context.prisma.landlordResetPasswordVerification.findOne(
    {
      where: {
        id: landlordRPVerificationId,
      },
      include: {
        user: true,
      },
    },
  );

  if (!landlordRPVerification) {
    throw new Error('Invalid verification code');
  }

  if (landlordRPVerification.verified) {
    throw new Error('Verification code already used.');
  }

  if (tokenQuery !== landlordRPVerification.tokenQuery) {
    throw new Error('Invalid token');
  }

  let targetUser = await context.prisma.landlordUser.findOne({
    where: { id: landlordRPVerification.user.id },
  });

  if (!targetUser) {
    throw new Error('User not found!');
  }
  let cryptedPassword = bcrypt.hashSync(password, 10);
  await context.prisma.landlordUser.update({
    data: {
      password: cryptedPassword,
    },
    where: {
      id: targetUser.id,
    },
  });
  await context.prisma.landlordResetPasswordVerification.update({
    data: {
      verified: true,
    },
    where: {
      id: landlordRPVerification.id,
    },
  });

  return {
    message: 'success',
    verificationId:
      Base64.encodeURI(landlordRPVerification.id) +
      ':' +
      landlordRPVerification.tokenQuery,
  };
};

export let resetPasswordLandlord = mutationField('resetPasswordLandlord', {
  type: 'LandlordRegisterResult',
  args: {
    password: stringArg({ required: true }),
    verificationCode: stringArg({ required: true }),
  },
  resolve: resetPasswordLandlordResolver,
});
