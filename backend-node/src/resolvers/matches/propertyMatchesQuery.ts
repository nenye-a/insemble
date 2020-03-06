import axios from 'axios';
import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { PropertyMatchesType } from 'dataTypes';

type MatchBrand = {
  brandId: string;
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
};

let propertyMatchesResolver: FieldResolver<'Query', 'propertyMatches'> = async (
  _: Root,
  { propertyId: prismaPropId },
  context: Context,
) => {
  let selectedProperty = await context.prisma.property.findOne({
    where: { id: prismaPropId },
    include: {
      location: true,
      space: true,
    },
  });
  if (!selectedProperty) {
    throw new Error('Property not found!');
  }
  let {
    propertyId,
    space,
    location,
    categories,
    propertyType,
    exclusive,
    businessType,
  } = selectedProperty;
  let {
    id: prismaSpaceId,
    sqft,
    pricePerSqft,
    condition,
    matchingBrand: savedMatchingBrands,
  } = space[0]; // TODO: Update after multispace
  let matchingBrands;

  if (savedMatchingBrands) {
    let existMatchingBrands: Array<MatchBrand> = JSON.parse(
      savedMatchingBrands,
    );
    matchingBrands = existMatchingBrands;
  } else {
    let { brands, property_id: newPropertyId }: PropertyMatchesType = (
      await axios.get(`${LEGACY_API_URI}/api/propertyTenants/`, {
        params: {
          property_id: propertyId ? propertyId : undefined,
          address: location.address,
          property_type:
            propertyType.length > 0 ? JSON.stringify(propertyType) : undefined,
          space_condition: JSON.stringify([condition]),
          tenant_type:
            businessType.length > 0 ? JSON.stringify(businessType) : undefined,
          sqft,
          asking_rent: sqft * pricePerSqft,
          target_categories:
            categories.length > 0 ? JSON.stringify(categories) : undefined,
          exclusives:
            exclusive.length > 0 ? JSON.stringify(exclusive) : undefined,
        },
      })
    ).data;
    let newMatchingBrands = brands?.map(
      ({
        match_value: matchValue,
        brand_id: brandId,
        matches_tenant_type: matchesTenantType,
        num_existing_locations: numExistingLocations,
        on_platform: onPlatform,
        photo_url: pictureUrl,
        ...other
      }) => {
        return {
          matchValue,
          brandId,
          matchesTenantType,
          numExistingLocations,
          onPlatform,
          pictureUrl,
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
  },
  resolve: propertyMatchesResolver,
  list: true,
});

export { propertyMatches };
