import { mutationField, arg, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';
import { uploadS3 } from '../../helpers/uploadUtils';

export let editSpaceResolver: FieldResolver<'Mutation', 'editSpace'> = async (
  _,
  { space, spaceId },
  context: Context,
) => {
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
    let { Location: mainPhotoUrl } = await uploadS3(mainPhoto, 'MAIN_SPACE');
    uploadedMainPhotoUrl = mainPhotoUrl;
  }
  let updatedSpace = await context.prisma.space.update({
    data: {
      ...spaceInput,
      mainPhoto: mainPhotoUrl || uploadedMainPhotoUrl,
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
