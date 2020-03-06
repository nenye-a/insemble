import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

let resetPasswordLandlordResolver: FieldResolver<
  'Query',
  'resetPasswordLandlordVerification'
> = async (_: Root, { verificationCode }, context: Context) => {
  let [verifyId, tokenEmail] = verificationCode
    ? verificationCode.split(':')
    : [];
  if (!verifyId || !tokenEmail) {
    throw new Error('Invalid verification code');
  }
  let landlordRPVerificationId = Base64.decode(verifyId);
  let decodedTokenEmail = Base64.decode(tokenEmail);
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

  if (decodedTokenEmail !== landlordRPVerification.tokenEmail) {
    throw new Error('Invalid token');
  }

  return {
    message: 'success',
    verificationId:
      Base64.encodeURI(landlordRPVerification.id) +
      ':' +
      landlordRPVerification.tokenQuery,
  };
};

let resetPasswordLandlordVerification = queryField(
  'resetPasswordLandlordVerification',
  {
    type: 'LandlordRegisterResult',
    resolve: resetPasswordLandlordResolver,
    args: {
      verificationCode: stringArg({ required: true }),
    },
  },
);

export { resetPasswordLandlordVerification };
