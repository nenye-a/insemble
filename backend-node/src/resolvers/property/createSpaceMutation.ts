import { mutationField, arg, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';
import { uploadS3 } from '../../helpers/uploadUtils';

export let createSpaceResolver: FieldResolver<
  'Mutation',
  'createSpace'
> = async (_, { space, propertyId }, context: Context) => {
  let property = await context.prisma.property.findOne({
    where: {
      id: propertyId,
    },
    include: {
      landlordUser: true,
    },
  });

  if (!property) {
    throw new Error('Property not found!');
  }

  if (property.landlordUser.id !== context.landlordUserId) {
    throw new Error('User not authorized to create new space');
  }

  let {
    equipment = [],
    photoUploads,
    available,
    mainPhoto,
    photoUrls = [],
    spaceType = [],
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

  let { Location: mainPhotoUrl } = await uploadS3(mainPhoto, 'MAIN_SPACE');
  let newSpace = await context.prisma.space.create({
    data: {
      ...spaceInput,
      mainPhoto: mainPhotoUrl,
      equipment: {
        set: equipment,
      },
      photos: {
        set: photoUrls,
      },
      spaceType: {
        set: spaceType,
      },
      property: { connect: { id: propertyId } },
      tier: 'PROFESSIONAL',
      available: new Date(available),
    },
  });
  return newSpace.id;
};

export let createSpace = mutationField('createSpace', {
  type: 'String',
  args: {
    space: arg({ type: 'CreateSpaceInput', required: true }),
    propertyId: stringArg({ required: true }),
  },
  resolve: createSpaceResolver,
});
