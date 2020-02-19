import { FieldResolver, mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';

let editProfileResolver: FieldResolver<
  'Mutation',
  'editProfileTenant'
> = async (_: Root, { profile }, context: Context) => {
  if (profile.email) {
    let lowercasedEmail = profile.email?.toLocaleLowerCase();
    let emailExist = await context.prisma.tenantUser.findOne({
      where: {
        email: lowercasedEmail,
      },
    });
    if (emailExist && emailExist.id !== context.tenantUserId) {
      throw new Error('Email already exist');
    }
  }
  if (profile.oldPassword && profile.newPassword) {
    let currentUser = await context.prisma.tenantUser.findOne({
      where: {
        id: context.tenantUserId,
      },
    });
    if (!currentUser) {
      throw new Error('User not found');
    }
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
  args: { profile: arg({ type: 'EditProfileInput', required: true }) },
  resolve: editProfileResolver,
});

export { editProfile };
