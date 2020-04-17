import axios from 'axios';
import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { PropertyMatchesType, ReceiverContact } from 'dataTypes';

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
    },
  });
  if (!selectedProperty) {
    throw new Error('Property not found!');
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
    let {
      brands,
      property_id: newPropertyId,
      space_id: newSpaceId,
    }: PropertyMatchesType = (
      await axios.get(`${LEGACY_API_URI}/api/propertyTenants/`, {
        params: {
          property_id: propertyId ? propertyId : undefined,
          space_id: selectedSpace.spaceId ? selectedSpace.spaceId : undefined,
          address: location.address,
          property_type: JSON.stringify(propertyType),
          space_type: JSON.stringify([condition]),
          tenant_type: JSON.stringify(businessType),
          sqft,
          asking_rent: sqft * pricePerSqft,
          target_categories:
            categories.length > 0 ? JSON.stringify(categories) : undefined,
          exclusives:
            exclusive.length > 0 ? JSON.stringify(exclusive) : undefined,
          visible: selectedSpace.marketingPreference === 'PUBLIC',
        },
        paramsSerializer: (params) => {
          let queryString = Object.keys(params)
            .filter((key) => params[key])
            .map((key) => {
              const regexSquareBracketOpen = /%5B/gi;
              const regexSquareBracketClose = /%5D/gi;
              let encodeInput = encodeURI(params[key]);
              let squareBracket = encodeInput
                .replace(regexSquareBracketOpen, '[')
                .replace(regexSquareBracketClose, ']');
              return encodeURI(key) + '=' + squareBracket;
            })
            .join('&');
          return queryString;
        },
      })
    ).data;
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
              matchingBrand: JSON.stringify(newMatchingBrands),
            },
          },
        },
      },
    });
    matchingBrands = newMatchingBrands;
  }
  return matchingBrands ? matchingBrands : [];
};

let propertyMatches = queryField('propertyMatches', {
  type: 'PropertyMatchesThumbnail',
  args: {
    propertyId: stringArg({ required: true }),
    spaceId: stringArg({ required: true }),
  },
  resolve: propertyMatchesResolver,
  list: true,
});

export { propertyMatches };
