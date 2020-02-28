import { mutationField, stringArg } from 'nexus';
import { createSession } from '../../helpers/auth';
import { Context } from 'serverTypes';

export let landlordVerification = mutationField('landlordVerification', {
  type: 'LandlordAuth',
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
      token: createSession(landlordUser, 'LANDLORD'),
      landlord: landlordUser,
    };
  },
});
