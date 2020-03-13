import { mutationField, arg, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';
import { uploadS3 } from '../../helpers/uploadUtils';

export let editSpaceResolver: FieldResolver<'Mutation', 'editSpace'> = async (
  _,
  { space, spaceId },
  context: Context,
) => {
  let properties = await context.prisma.property.findMany({
    where: {
      space: { some: { id: spaceId } },
    },
    include: {
      landlordUser: true,
    },
  });

  if (!properties.length) {
    throw new Error('Property not found!');
  }

  if (properties[0].landlordUser.id !== context.landlordUserId) {
    throw new Error('User not authorized to create new space');
  }
  let {
    equipment = [],
    photoUrls = [],
    available,
    mainPhoto,
    mainPhotoUrl,
    photoUploads,
    ...spaceInput
  } = space || {};
  if (!photoUrls) {
    photoUrls = [];
  }

  if (photoUploads) {
    for (let photoFile of photoUploads) {
      let { Location: photoUrl } = await uploadS3(photoFile, 'SPACE');
      photoUrls.push(photoUrl);
    }
  }
  let uploadedMainPhotoUrl = '';
  if (mainPhoto) {
    let { Location: url } = await uploadS3(mainPhoto, 'MAIN_SPACE');
    uploadedMainPhotoUrl = url;
  }
  let updatedSpace = await context.prisma.space.update({
    data: {
      ...spaceInput,
      mainPhoto: uploadedMainPhotoUrl || mainPhotoUrl,
      equipment: {
        set: equipment,
      },
      photos: {
        set: photoUrls,
      },
      available: new Date(available),
      matchingBrand: null,
    },
    where: {
      id: spaceId,
    },
  });

  return updatedSpace.id;
};

export let editSpace = mutationField('editSpace', {
  type: 'String',
  args: {
    space: arg({ type: 'SpaceInput', required: true }),
    spaceId: stringArg({ required: true }),
  },
  resolve: editSpaceResolver,
});
