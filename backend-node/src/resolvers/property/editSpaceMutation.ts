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
    photosUrl = [],
    available,
    mainPhoto,
    photosUpload,
    ...spaceInput
  } = space || {};
  if (!photosUrl) {
    photosUrl = [];
  }

  if (photosUpload) {
    for (let photoFile of photosUpload) {
      let { Location: photoUrl } = await uploadS3(photoFile, 'MAIN_SPACE');
      photosUrl.push(photoUrl);
    }
  }

  let { Location: mainPhotoUrl } = await uploadS3(mainPhoto, 'MAIN_SPACE');
  let updatedSpace = await context.prisma.space.update({
    data: {
      ...spaceInput,
      mainPhoto: mainPhotoUrl,
      equipment: {
        set: equipment,
      },
      photos: {
        set: photosUrl,
      },
      available: new Date(available),
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
