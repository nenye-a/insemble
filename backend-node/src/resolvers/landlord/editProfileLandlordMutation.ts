import { FieldResolver, mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';

import { Root, Context } from 'serverTypes';
import { uploadS3 } from '../../helpers/uploadUtils';

let editProfileResolver: FieldResolver<
  'Mutation',
  'editProfileLandlord'
> = async (_: Root, { profile }, context: Context) => {
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
  }

  if (profile.oldPassword && profile.newPassword) {
    let currentUser = await context.prisma.landlordUser.findOne({
      where: {
        id: context.landlordUserId,
      },
    });
    if (!currentUser) {
      throw new Error('User not found');
    }
    if (!bcrypt.compareSync(profile.oldPassword, currentUser.password || '')) {
      throw new Error('Wrong current password');
    }
  }
  let { oldPassword, newPassword, email, avatar, ...updateData } = profile;
  let password = newPassword ? bcrypt.hashSync(newPassword, 10) : undefined;
  let { Location: avatarUrl } = avatar && (await uploadS3(avatar, 'LANDLORD'));
  let landlord = await context.prisma.landlordUser.update({
    data: {
      ...updateData,
      avatar: avatar ? avatarUrl : undefined,
      email: profile.email?.toLocaleLowerCase(),
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
