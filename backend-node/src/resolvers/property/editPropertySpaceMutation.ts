import { mutationField, arg, FieldResolver, stringArg } from 'nexus';

import { Context } from 'serverTypes';
import { uploadS3 } from '../../helpers/uploadUtils';

export let editPropertySpaceResolver: FieldResolver<
  'Mutation',
  'editPropertySpace'
> = async (_, { property, propertyId, space, spaceId }, context: Context) => {
  let {
    businessType = [],
    propertyType = [],
    categories = [],
    exclusive = [],
    location,
    ...propertyInput
  } = property;
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

  let updatedProperty = await context.prisma.property.update({
    data: {
      ...propertyInput,
      location: {
        update: location,
      },
      categories: {
        set: categories,
      },
      exclusive: {
        set: exclusive,
      },
      businessType: {
        set: businessType,
      },
      propertyType: {
        set: propertyType,
      },
      space: {
        update: {
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
        },
      },
    },
    where: {
      id: propertyId,
    },
  });

  return updatedProperty.id;
};

export let editPropertySpace = mutationField('editPropertySpace', {
  type: 'String',
  args: {
    property: arg({ type: 'PropertyInput', required: true }),
    propertyId: stringArg({ required: true }),
    space: arg({ type: 'SpaceInput', required: true }),
    spaceId: stringArg({ required: true }),
  },
  resolve: editPropertySpaceResolver,
});
