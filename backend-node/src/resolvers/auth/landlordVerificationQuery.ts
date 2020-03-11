import { queryField, stringArg } from 'nexus';
import { createSession } from '../../helpers/auth';
import { Context } from 'serverTypes';

export let landlordVerification = queryField('landlordRegisterVerification', {
  type: 'LandlordRegisterVerification',
  args: {
    verificationId: stringArg({
      required: true,
    }), // TODO: fix naming args
  },
  resolve: async (_, { verificationId }, context: Context) => {
    let [verifyId, tokenQuery] = verificationId
      ? verificationId.split(':')
      : [];
    if (!verifyId || !tokenQuery) {
      throw new Error('Invalid verification code');
    }
    let landlordVerificationId = Base64.decode(verifyId);
    let landlordTokenQuery = Base64.decode(tokenQuery);
    let landlordVerification = await context.prisma.landlordRegisterVerification.findOne(
      {
        where: {
          id: landlordVerificationId,
        },
      },
    );
    if (!landlordVerification) {
      throw new Error('Invalid verification ID');
    }
    let landlordUser = await context.prisma.landlordUser.findOne({
      where: {
        email: landlordVerification.email,
      },
    });
    if (!landlordUser) {
      throw new Error('User not found');
    }

    if (landlordTokenQuery !== landlordVerification.tokenQuery) {
      throw new Error('Invalid token');
    }
    return {
      ...landlordVerification,
      landlordAuth: {
        token: createSession(landlordUser, 'LANDLORD'),
        landlord: landlordUser,
      },
    };
  },
});
