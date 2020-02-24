import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField, arg } from 'nexus';
import { TenantMatchesType } from 'dataTypes';

export type MatchingLocation = {
  loc_id: string;
  lat: number;
  lng: number;
  match: number;
};

let tenantMatches = queryField('tenantMatches', {
  type: 'Brand',
  args: {
    brandId: arg({ type: 'String', required: true }),
  },
  resolve: async (_: Root, { brandId }, context: Context) => {
    let selectedBrand = await context.prisma.brand.findOne({
      where: { id: brandId },
      include: {
        location: true,
        matchingProperties: true,
        nextLocations: true,
      },
    });
    if (!selectedBrand) {
      throw new Error('Brand not found!');
    }
    let {
      categories,
      location,
      name,
      maxIncome,
      minIncome,
      minAge,
      maxAge,
      personas,
      commute,
      education,
      minRent,
      maxRent,
      matchingLocations: matchingLocationsJSON,
      matchingProperties,

      // NOTE: Unused filter params, will use later!
      equipment,
      ethnicity,
      minDaytimePopulation,
      locationCount,
      minSize,
      newLocationPlan,
      spaceType,
      userRelation,
      minFrontageWidth,
      nextLocations,
    } = selectedBrand;

    if (!(name && location) && !(categories.length > 0 && minIncome)) {
      throw new Error(
        'Please update your brand and provide either (address and brand_name) or (categories and income)',
      );
    }
    let matchingLocations;

    if (matchingLocationsJSON) {
      let existMatchingLocations: Array<MatchingLocation> = JSON.parse(
        matchingLocationsJSON,
      );
      matchingLocations = existMatchingLocations;
    } else {
      let {
        matching_locations: newMatchingLocations,
        matching_properties: rawMatchingProperties,
      }: TenantMatchesType = (
        await axios.get(`${LEGACY_API_URI}/api/tenantMatches`, {
          params: {
            address: location?.address,
            brand_name: name,
            categories:
              categories.length > 0 ? JSON.stringify(categories) : undefined,
            income: minIncome && {
              min: maxIncome,
              max: maxIncome,
            },
            age: minAge && {
              min: minAge,
              max: maxAge,
            },
            personas:
              personas.length > 0 ? JSON.stringify(personas) : undefined,
            commute: commute.length > 0 ? JSON.stringify(commute) : undefined,
            education:
              education.length > 0 ? JSON.stringify(education) : undefined,
            rent: minRent && {
              min: minRent,
              max: maxRent,
            },
          },
        })
      ).data;
      let newMatchingProperties = rawMatchingProperties?.map(
        ({ property_id: propertyId, ...other }) => {
          return { propertyId, ...other };
        },
      );
      matchingLocations = newMatchingLocations;
      matchingProperties = await context.prisma.brand
        .update({
          where: { id: brandId },
          data: {
            matchingLocations: JSON.stringify(newMatchingLocations),
            matchingProperties: { create: newMatchingProperties },
          },
        })
        .matchingProperties();
    }

    return {
      id: brandId,
      matchingLocations,
      matchingProperties,
      categories,
      location,
      name,
      maxIncome,
      minIncome,
      minAge,
      maxAge,
      personas,
      commute: commute.map((rawValue) => {
        let splitCommuteValue = rawValue.split(': ');
        return {
          rawValue,
          displayValue: splitCommuteValue[1],
        };
      }),
      education: education.map((rawValue) => {
        let splitEducationValue = rawValue.split('+, ');
        return {
          rawValue,
          displayValue: splitEducationValue[1],
        };
      }),
      ethnicity: ethnicity.map((rawValue) => {
        let splitEthnicityValue = rawValue.split('Population, ');
        return {
          rawValue,
          displayValue: splitEthnicityValue[1],
        };
      }),
      minRent,
      maxRent,
      equipment,
      minDaytimePopulation,
      locationCount,
      minSize,
      newLocationPlan,
      spaceType,
      userRelation,
      minFrontageWidth,
      nextLocations,
    };
  },
});

export { tenantMatches };
