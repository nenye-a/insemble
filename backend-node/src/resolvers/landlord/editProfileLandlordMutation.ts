import { FieldResolver, mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { uploadS3 } from '../../helpers/uploadUtils';
import { NODE_ENV, HOST } from '../../constants/constants';
import { sendVerificationEmail } from '../../helpers/sendEmail';
import getRandomBytes from '../../helpers/getRandomBytes';

let editProfileResolver: FieldResolver<
  'Mutation',
  'editProfileLandlord'
> = async (_: Root, { profile }, context: Context) => {
  let currentUser = await context.prisma.landlordUser.findOne({
    where: {
      id: context.landlordUserId,
    },
  });
  if (!currentUser) {
    throw new Error('User not found');
  }

  if (profile.email) {
    let lowercasedEmail = profile.email?.toLocaleLowerCase();
    let emailExist = await context.prisma.landlordUser.findOne({
      where: {
        email: lowercasedEmail,
      },
    });

    if (emailExist && emailExist.id !== context.landlordUserId) {
      throw new Error('Email already exist');
    }

    let bytesEmail = await getRandomBytes(18);
    let landlordEmailVerification = await context.prisma.landlordEmailVerification.create(
      {
        data: {
          email: lowercasedEmail,
          user: {
            connect: { id: context.landlordUserId },
          },
          tokenEmail: bytesEmail.toString('base64'),
        },
      },
    );
    let emailVerifyCode =
      Base64.encodeURI(landlordEmailVerification.id) +
      ':' +
      Base64.encodeURI(landlordEmailVerification.tokenEmail);

    await context.prisma.landlordUser.update({
      data: {
        pendingEmail: true,
      },
      where: {
        id: context.landlordUserId,
      },
    });

    if (NODE_ENV === 'production') {
      sendVerificationEmail(
        {
          email: landlordEmailVerification.email,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
        },
        `${HOST}/email-landlord-verification/${emailVerifyCode}`,
      );
    } else {
      // console the verification id so we could still test it on dev environment
      // eslint-disable-next-line no-console
      console.log(emailVerifyCode);
    }
  }

  if (profile.oldPassword && profile.newPassword) {
    if (!bcrypt.compareSync(profile.oldPassword, currentUser.password || '')) {
      throw new Error('Wrong current password');
    }
  }
  let { oldPassword, newPassword, email, avatar, ...updateData } = profile;
  let password = newPassword ? bcrypt.hashSync(newPassword, 10) : undefined;
  let { Location: avatarUrl } = (avatar &&
    (await uploadS3(avatar, 'LANDLORD'))) || { Location: undefined };
  let landlord = await context.prisma.landlordUser.update({
    data: {
      ...updateData,
      avatar: avatar ? avatarUrl : undefined,
      password,
    },
    where: {
      id: context.landlordUserId,
    },
  });
  return landlord;
};

let editProfileLandlord = mutationField('editProfileLandlord', {
  type: 'LandlordUser',
  args: { profile: arg({ type: 'EditProfileInput', required: true }) },
  resolve: editProfileResolver,
});

export { editProfileLandlord };
