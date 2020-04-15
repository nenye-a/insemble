import { mutationField, arg, FieldResolver } from 'nexus';

import { Context } from 'serverTypes';
import { uploadS3 } from '../../helpers/uploadUtils';

export let createPropertyResolver: FieldResolver<
  'Mutation',
  'createProperty'
> = async (_, { property, space }, context: Context) => {
  let {
    businessType = [],
    exclusive = [],
    userRelations = [],
    location,
    ...propertyInput
  } = property;
  let {
    equipment = [],
    photoUploads,
    available,
    spaceType = [],
    mainPhoto,
    photoUrls = [],
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
  let newProperty = await context.prisma.property.create({
    data: {
      ...propertyInput,
      location: {
        create: location,
      },
      exclusive: {
        set: exclusive,
      },
      businessType: {
        set: businessType,
      },
      userRelations: {
        set: userRelations,
      },
      userRelation: '', //TODO: remove this after userRelation successfully migrated
      marketingPreference: spaceInput.marketingPreference, //TODO: remove this after marketingPreference successfully migrated
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
          spaceType: {
            set: spaceType,
          },
          tier: 'PROFESSIONAL',
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
    space: arg({ type: 'CreateSpaceInput', required: true }),
  },
  resolve: createPropertyResolver,
});
