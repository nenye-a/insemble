import { mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';
import { Context } from 'serverTypes';
import { NODE_ENV, HOST } from '../../constants/constants';
import { sendVerificationEmail } from '../../helpers/sendEmail';
import getRandomBytes from '../../helpers/getRandomBytes';

export let registerLandlord = mutationField('registerLandlord', {
  type: 'LandlordRegisterResult',
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
    let bytesEmail = await getRandomBytes(18);
    let bytesQuery = await getRandomBytes(18);

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
          tokenEmail: bytesEmail.toString('base64'),
          tokenQuery: bytesQuery.toString('base64'),
        },
      },
    );

    let emailVerifyCode =
      Base64.encodeURI(landlordVerification.id) +
      ':' +
      Base64.encodeURI(landlordVerification.tokenEmail);
    if (NODE_ENV === 'production') {
      sendVerificationEmail(
        {
          email: `${landlord.email}`,
          name: `${landlord.firstName} ${landlord.lastName}`,
        },
        `${HOST}/register-landlord-verification/${emailVerifyCode}`,
      );
    } else {
      // console the verification id so we could still test it on dev environment
      // eslint-disable-next-line no-console
      console.log(emailVerifyCode);
    }
    return {
      message: 'success',
      verificationId:
        Base64.encodeURI(landlordVerification.id) +
        ':' +
        Base64.encodeURI(landlordVerification.tokenQuery),
    };
  },
});
