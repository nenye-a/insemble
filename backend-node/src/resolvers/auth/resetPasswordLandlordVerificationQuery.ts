import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

let resetPasswordLandlordResolver: FieldResolver<
  'Query',
  'resetPasswordLandlordVerification'
> = async (_: Root, { verificationCode }, context: Context) => {
  let landlordRPVerificationId = Base64.decode(verificationCode);
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

  return { message: 'success', verificationId: landlordRPVerification.id };
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
