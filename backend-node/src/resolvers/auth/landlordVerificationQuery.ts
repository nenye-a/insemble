import { queryField, stringArg } from 'nexus';
import { createSession } from '../../helpers/auth';
import { Context } from 'serverTypes';

export let landlordVerification = queryField('landlordRegisterVerification', {
  type: 'LandlordRegisterVerification',
  args: {
    verificationId: stringArg({
      required: true,
    }),
  },
  resolve: async (_, { verificationId }, context: Context) => {
    let landlordVerification = await context.prisma.landlordRegisterVerification.findOne(
      {
        where: {
          id: verificationId,
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
    return {
      ...landlordVerification,
      landlordAuth: {
        token: createSession(landlordUser, 'LANDLORD'),
        landlord: landlordUser,
      },
    };
  },
});
