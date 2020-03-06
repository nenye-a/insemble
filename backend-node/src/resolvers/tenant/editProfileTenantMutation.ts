import { FieldResolver, mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { sendVerificationEmail } from '../../helpers/sendEmail';
import { HOST, NODE_ENV } from '../../constants/constants';
import { uploadS3 } from '../../helpers/uploadUtils';
import getRandomBytes from '../../helpers/getRandomBytes';

let editProfileResolver: FieldResolver<
  'Mutation',
  'editProfileTenant'
> = async (_: Root, { profile }, context: Context) => {
  let currentUser = await context.prisma.tenantUser.findOne({
    where: {
      id: context.tenantUserId,
    },
  });
  if (!currentUser) {
    throw new Error('User not found');
  }
  if (profile.email && profile.email !== currentUser.email) {
    let lowercasedEmail = profile.email?.toLocaleLowerCase();
    let emailExist = await context.prisma.tenantUser.findOne({
      where: {
        email: lowercasedEmail,
      },
    });
    if (emailExist && emailExist.id !== context.tenantUserId) {
      throw new Error('Email already exist');
    }

    let bytesEmail = await getRandomBytes(18);
    let tenantEmailVerification = await context.prisma.tenantEmailVerification.create(
      {
        data: {
          email: lowercasedEmail,
          user: {
            connect: { id: context.tenantUserId },
          },
          tokenEmail: bytesEmail.toString('base64'),
        },
      },
    );
    await context.prisma.tenantUser.update({
      data: {
        pendingEmail: true,
      },
      where: {
        id: context.tenantUserId,
      },
    });
    let emailVerifyCode =
      Base64.encodeURI(tenantEmailVerification.id) +
      ':' +
      Base64.encodeURI(tenantEmailVerification.tokenEmail);
    if (NODE_ENV === 'production') {
      sendVerificationEmail(
        {
          email: tenantEmailVerification.email,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
        },
        `${HOST}/email-tenant-verification/${emailVerifyCode}`,
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
  let { Location: avatarUrl } = avatar && (await uploadS3(avatar, 'TENANT'));
  let tenant = await context.prisma.tenantUser.update({
    data: {
      ...updateData,
      avatar: avatar ? avatarUrl : undefined,
      password,
    },
    where: {
      id: context.tenantUserId,
    },
  });
  return tenant;
};

let editProfileTenant = mutationField('editProfileTenant', {
  type: 'TenantUser',
  args: {
    profile: arg({ type: 'EditProfileInput', required: true }),
  },
  resolve: editProfileResolver,
});

export { editProfileTenant };
