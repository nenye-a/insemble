import { FieldResolver, mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { sendTenantVerificationEmail } from '../../helpers/sendEmail';
import { HOST, NODE_ENV } from '../../constants/constants';

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
    let tenantEmailVerification = await context.prisma.tenantEmailVerification.create(
      {
        data: {
          email: lowercasedEmail,
          user: {
            connect: { id: context.tenantUserId },
          },
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
    if (NODE_ENV === 'production') {
      sendTenantVerificationEmail(
        {
          email: tenantEmailVerification.email,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
        },
        `${HOST}/email-tenant-verification/${Base64.encodeURI(
          tenantEmailVerification.id,
        )}`,
      );
    } else {
      // console the verification id so we could still test it on dev environment
      // eslint-disable-next-line no-console
      console.log(Base64.encodeURI(tenantEmailVerification.id));
    }
  }
  if (profile.oldPassword && profile.newPassword) {
    if (!bcrypt.compareSync(profile.oldPassword, currentUser.password || '')) {
      throw new Error('Wrong current password');
    }
  }
  let { oldPassword, newPassword, email, ...updateData } = profile;
  let password = newPassword ? bcrypt.hashSync(newPassword, 10) : undefined;
  let tenant = await context.prisma.tenantUser.update({
    data: {
      ...updateData,
      email: profile.email?.toLocaleLowerCase(),
      password,
    },
    where: {
      id: context.tenantUserId,
    },
  });
  return tenant;
};

let editProfile = mutationField('editProfileTenant', {
  type: 'TenantUser',
  args: { profile: arg({ type: 'EditProfileTenantInput', required: true }) },
  resolve: editProfileResolver,
});

export { editProfile };
