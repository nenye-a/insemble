import { Root, Context } from 'serverTypes';
import { queryField, arg } from 'nexus';

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
      matchingLocations = null;
      matchingProperties = [];
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
