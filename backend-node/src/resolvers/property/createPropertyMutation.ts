import { mutationField, arg, FieldResolver } from 'nexus';

import { Context } from 'serverTypes';
import { uploadS3 } from '../../helpers/uploadUtils';

export let createPropertyResolver: FieldResolver<
  'Mutation',
  'createProperty'
> = async (_, { property, space }, context: Context) => {
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
    photoUploads,
    available,
    mainPhoto,
    photoUrls = [],
    ...spaceInput
  } = space || {};
  if (!photoUrls) {
    photoUrls = [];
  }

  if (photoUploads) {
    for (let photoFile of photoUploads) {
      let { Location: photoUrl } = await uploadS3(photoFile, 'MAIN_SPACE');
      photoUrls.push(photoUrl);
    }
  }

  let { Location: mainPhotoUrl } = await uploadS3(mainPhoto, 'MAIN_SPACE');
  let newProperty = await context.prisma.property.create({
    data: {
      ...propertyInput,
      location: {
        create: location,
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
        create: {
          ...spaceInput,
          mainPhoto: mainPhotoUrl,
          equipment: {
            set: equipment,
          },
          photos: {
            set: photoUrls,
          },
          available: new Date(available),
        },
      },
      landlordUser: {
        connect: {
          id: context.landlordUserId,
        },
      },
    },
  });
  return newProperty.id;
};

export let createProperty = mutationField('createProperty', {
  type: 'String',
  args: {
    property: arg({ type: 'PropertyInput', required: true }),
    space: arg({ type: 'SpaceInput', required: true }),
  },
  resolve: createPropertyResolver,
});
