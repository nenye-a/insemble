import axios from 'axios';
import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { PropertyMatchesType, ReceiverContact } from 'dataTypes';
import { axiosParamsSerializer } from '../../helpers/axiosParamsCustomSerializer';
import { trialCheck } from '../../helpers/trialCheck';

type MatchBrand = {
  brandId: string;
  matchId: string | null | undefined;
  name: string;
  pictureUrl: string;
  category: string;
  numExistingLocations: number;
  matchValue: number;
  interested: boolean;
  verified: boolean;
  claimed: boolean;
  matchesTenantType: boolean;
  onPlatform: boolean;
  contacts: Array<ReceiverContact>;
};

let propertyMatchesResolver: FieldResolver<'Query', 'propertyMatches'> = async (
  _: Root,
  { propertyId: prismaPropId, spaceId: prismaSpaceId },
  context: Context,
) => {
  let selectedProperty = await context.prisma.property.findOne({
    where: { id: prismaPropId },
    include: {
      location: true,
      landlordUser: true,
    },
  });
  if (!selectedProperty) {
    throw new Error('Property not found!');
  }
  if (selectedProperty.landlordUser.id !== context.landlordUserId) {
    throw new Error('This is not your propeerty. Not authenticated.');
  }
  let {
    propertyId,
    location,
    categories,
    propertyType,
    exclusive,
    businessType,
  } = selectedProperty;
  let selectedSpace = await context.prisma.space.findOne({
    where: { id: prismaSpaceId },
    include: {
      property: true,
    },
  });

  if (!selectedSpace) {
    throw new Error('Property not found!');
  }

  if (selectedSpace.property?.id !== selectedProperty.id) {
    throw new Error('Invalid spaceId');
  }
  let isTrial = trialCheck(selectedProperty.landlordUser.createdAt);
  if (!isTrial) {
    if (
      selectedSpace.tier !== 'NO_TIER' &&
      !selectedSpace.stripeSubscriptionId
    ) {
      selectedSpace = await context.prisma.space.update({
        where: { id: selectedSpace.id },
        data: { tier: 'NO_TIER' },
        include: { property: true },
      });
    }
  }
  if (selectedSpace.tier === 'NO_TIER') {
    throw new Error('Space locked, please upgrade to basic or pro to access.');
  }
  if (selectedSpace.error) {
    await context.prisma.space.update({
      where: {
        id: prismaSpaceId,
      },
      data: {
        error: null,
      },
    });
    return {
      data: null,
      error: selectedSpace.error,
      polling: selectedSpace.polling,
    };
  }

  let {
    sqft,
    pricePerSqft,
    condition,
    matchingBrand: savedMatchingBrands,
  } = selectedSpace;
  let matchingBrands;

  if (savedMatchingBrands) {
    let existMatchingBrands: Array<MatchBrand> = JSON.parse(
      savedMatchingBrands,
    );
    matchingBrands = existMatchingBrands;
  } else {
    if (!selectedSpace.polling) {
      selectedSpace = await context.prisma.space.update({
        where: {
          id: prismaSpaceId,
        },
        data: {
          polling: true,
        },
        include: {
          property: true,
        },
      });
      axios
        .get(`${LEGACY_API_URI}/api/propertyTenants/`, {
          params: {
            property_id: propertyId ? propertyId : undefined,
            space_id: selectedSpace.spaceId ? selectedSpace.spaceId : undefined,
            address: location.address,
            property_type: JSON.stringify(propertyType),
            space_type: JSON.stringify([condition]),
            tenant_type: JSON.stringify(businessType),
            sqft,
            asking_rent: pricePerSqft,
            target_categories:
              categories.length > 0 ? JSON.stringify(categories) : undefined,
            exclusives:
              exclusive.length > 0 ? JSON.stringify(exclusive) : undefined,
            visible: selectedSpace.marketingPreference === 'PUBLIC',
          },
          paramsSerializer: axiosParamsSerializer,
        })
        .then(async ({ data }) => {
          let {
            brands,
            property_id: newPropertyId,
            space_id: newSpaceId,
          }: PropertyMatchesType = data;
          let newMatchingBrands = brands?.map(
            ({
              match_value: matchValue,
              match_id: matchId,
              brand_id: brandId,
              matches_tenant_type: matchesTenantType,
              number_existing_locations: numExistingLocations,
              on_platform: onPlatform,
              photo_url: pictureUrl,
              contacts,
              ...other
            }) => {
              return {
                matchValue,
                brandId,
                matchId,
                matchesTenantType,
                numExistingLocations,
                onPlatform,
                pictureUrl: pictureUrl || '',
                contacts: contacts || [],
                ...other,
              };
            },
          );

          await context.prisma.property.update({
            where: {
              id: prismaPropId,
            },
            data: {
              propertyId: newPropertyId,
              space: {
                update: {
                  where: { id: prismaSpaceId },
                  data: {
                    spaceId: newSpaceId,
                    polling: false,
                    matchingBrand: JSON.stringify(newMatchingBrands),
                  },
                },
              },
            },
          });
        })
        .catch(async () => {
          await context.prisma.space.update({
            where: { id: prismaSpaceId },
            data: {
              error: 'Failed to get property matches. Please try again.',
              polling: false,
            },
          });
        });
    }
  }
  return {
    data: matchingBrands
      ? selectedSpace.tier === 'PROFESSIONAL'
        ? matchingBrands
        : matchingBrands.filter(({ interested }) => interested === true)
      : null,
    polling: selectedSpace.polling,
    error: selectedSpace.error,
  };
};

let propertyMatches = queryField('propertyMatches', {
  type: 'PropertyMatchesPolling',
  args: {
    propertyId: stringArg({ required: true }),
    spaceId: stringArg({ required: true }),
  },
  resolve: propertyMatchesResolver,
});

export { propertyMatches };
