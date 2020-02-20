import { mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';
import { createSession } from '../../helpers/auth';
import { Context } from 'serverTypes';

export let registerLandlord = mutationField('registerLandlord', {
  type: 'LandlordAuth',
  args: {
    landlord: arg({ type: 'LandlordRegisterInput', required: true }),
  },
  resolve: async (_, { landlord }, context: Context) => {
    let password = bcrypt.hashSync(landlord.password, 10);
    let lowerCasedEmail = landlord.email.toLocaleLowerCase();
    let exist = await context.prisma.landlordUser.findMany({
      where: {
        email: lowerCasedEmail,
      },
    });
    if (exist.length) {
      throw new Error('user already exist');
    }
    let createdLandlord = await context.prisma.landlordUser.create({
      data: {
        ...landlord,
        email: lowerCasedEmail,
        password,
        tier: 'FREE',
      },
    });
    return {
      token: createSession(createdLandlord, 'LANDLORD'),
    };
  },
});
