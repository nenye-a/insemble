import { mutationField, FieldResolver, stringArg } from 'nexus';
import { Base64 } from 'js-base64';

import { Context } from 'serverTypes';
import { sendForgotPasswordEmail } from '../../helpers/sendEmail';
import { NODE_ENV, FRONTEND_HOST } from '../../constants/constants';

let forgotPasswordLandlordResolver: FieldResolver<
  'Mutation',
  'forgotPasswordLandlord'
> = async (_, { email }, context: Context) => {
  let lowerCasedEmail = email.toLocaleLowerCase();
  let existing = await context.prisma.landlordUser.findOne({
    where: { email: lowerCasedEmail },
  });
  if (!existing) {
    throw new Error('User not found!');
  }
  let landlordRPVerification;
  let existingLandlordRPVerification = await context.prisma.landlordResetPasswordVerification.findMany(
    {
      where: {
        email: lowerCasedEmail,
        verified: false,
      },
    },
  );
  if (existingLandlordRPVerification.length) {
    landlordRPVerification = existingLandlordRPVerification[0];
  } else {
    landlordRPVerification = await context.prisma.landlordResetPasswordVerification.create(
      {
        data: {
          user: { connect: { id: existing.id } },
          email: lowerCasedEmail,
        },
      },
    );
  }

  if (NODE_ENV === 'production') {
    sendForgotPasswordEmail(
      {
        email: `${existing.email}`,
        name: `${existing.firstName} ${existing.lastName}`,
      },
      `${FRONTEND_HOST}/reset-password-landlord/${Base64.encodeURI(
        landlordRPVerification.id,
      )}`,
    );
  } else {
    // console the verification id so we could still test it on dev environment
    // eslint-disable-next-line no-console
    console.log(Base64.encodeURI(landlordRPVerification.id));
  }

  return { message: 'success', verificationId: landlordRPVerification.id };
};

export let forgotPasswordLandlord = mutationField('forgotPasswordLandlord', {
  type: 'LandlordRegisterResult',
  args: {
    email: stringArg({ required: true }),
  },
  resolve: forgotPasswordLandlordResolver,
});
