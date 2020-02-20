import { mutationField, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';

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
    });
    if (!landlordUser) {
      throw new Error('Email not found or wrong password');
    }
    let validPassword = bcrypt.compareSync(password, landlordUser.password);
    if (!validPassword) {
      throw new Error('Email not found or wrong password');
    }
    return {
      token: createSession(landlordUser, 'LANDLORD'),
      landlord: landlordUser,
    };
  },
});

export { loginLandlord };
