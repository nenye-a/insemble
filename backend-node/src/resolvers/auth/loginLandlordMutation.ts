import { mutationField, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';
import { trialCheck } from '../../helpers/trialCheck';

let loginLandlord = mutationField('loginLandlord', {
  type: 'LandlordAuth',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  resolve: async (_: Root, { email, password }, context: Context) => {
    let lowercasedEmail = email.toLowerCase();
    let landlordUser = await context.prisma.landlordUser.findOne({
      where: {
        email: lowercasedEmail,
      },
      include: { properties: { include: { space: true } } },
    });
    if (!landlordUser) {
      throw new Error('Email not found or wrong password');
    }
    let validPassword = bcrypt.compareSync(password, landlordUser.password);
    if (!validPassword) {
      throw new Error('Email not found or wrong password');
    }
    let isTrial = trialCheck(landlordUser.createdAt);
    if (!isTrial) {
      if (
        landlordUser.properties.some(({ space }) =>
          space.some(
            ({ stripeSubscriptionId, tier }) =>
              !stripeSubscriptionId && tier !== 'NO_TIER',
          ),
        )
      ) {
        await context.prisma.space.updateMany({
          where: {
            stripeSubscriptionId: null,
            property: {
              landlordUser: {
                id: landlordUser.id,
              },
            },
          },
          data: {
            tier: 'NO_TIER',
          },
        });
      }
    }
    return {
      token: createSession(landlordUser, 'LANDLORD'),
      landlord: { ...landlordUser, trial: true },
    };
  },
});

export { loginLandlord };
