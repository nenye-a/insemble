import { mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';
import { Context } from 'serverTypes';
import { NODE_ENV, HOST } from '../../constants/constants';
import { sendVerificationEmail } from '../../helpers/sendEmail';

export let registerLandlord = mutationField('registerLandlord', {
  type: 'LandlordRegisterResult',
  args: {
    landlord: arg({ type: 'LandlordRegisterInput', required: true }),
  },
  resolve: async (_, { landlord }, context: Context, info) => {
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
    let landlordVerification = await context.prisma.landlordRegisterVerification.create(
      {
        data: {
          landlordInput: JSON.stringify({
            ...landlord,
            email: lowerCasedEmail,
            password,
            tier: 'FREE',
          }),
          email: lowerCasedEmail,
        },
      },
    );

    if (NODE_ENV === 'production') {
      sendVerificationEmail(
        {
          email: `${landlord.email}`,
          name: `${landlord.firstName} ${landlord.lastName}`,
        },
        `${HOST}/register-landlord-verification/${Base64.encodeURI(
          landlordVerification.id,
        )}`,
      );
    } else {
      // console the verification id so we could still test it on dev environment
      // eslint-disable-next-line no-console
      console.log(Base64.encodeURI(landlordVerification.id));
    }
    return { message: 'success', verificationId: landlordVerification.id };
  },
});
