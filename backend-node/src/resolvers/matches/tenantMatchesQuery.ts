import axios from 'axios';
import { queryField, arg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import {
  TenantMatchesType,
  MatchingLocation,
  MatchingProperty,
} from 'dataTypes';

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
        nextLocations: true,
      },
    });
    if (!selectedBrand) {
      throw new Error('Brand not found!');
    }
    let {
      matchId,
      tenantId,
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
      matchingProperties: matchingPropertiesJSON,
      minSize,
      maxSize,
      minDaytimePopulation,
      minFrontageWidth,
      spaceType, // NOTE: This actually propertyType(inline, pedestrian etc)

      // NOTE: Unused filter params, will use later!
      equipment,
      ethnicity,
      locationCount,
      newLocationPlan,
      userRelation,
      nextLocations,
    } = selectedBrand;

    if (!(name && location) && !(categories.length > 0 && minIncome)) {
      throw new Error(
        'Please update your brand and provide either (address and brand_name) or (categories and income)',
      );
    }
    let matchingLocations;
    let matchingProperties;

    if (matchingLocationsJSON) {
      let existMatchingLocations: Array<MatchingLocation> = JSON.parse(
        matchingLocationsJSON,
      );
      let existMatchingProperties: Array<MatchingProperty> = matchingPropertiesJSON
        ? JSON.parse(matchingPropertiesJSON)
        : [];
      matchingProperties = existMatchingProperties;
      matchingLocations = existMatchingLocations;
    } else {
      let {
        brand_id: newTenantId,
        match_id: newMatchId,
        matching_locations: newMatchingLocations,
        matching_properties: rawMatchingProperties = [],
      }: TenantMatchesType = (
        await axios.get(`${LEGACY_API_URI}/api/tenantMatches/`, {
          params: {
            address: location?.address,
            brand_name: name,
            categories:
              categories.length > 0 ? JSON.stringify(categories) : undefined,
            income: minIncome && {
              min: minIncome,
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
            ethnicity:
              ethnicity.length > 0 ? JSON.stringify(ethnicity) : undefined,
            rent: minRent && {
              min: minRent,
              max: maxRent,
            },
            sqft: minSize && {
              min: minSize,
              max: maxSize,
            },
            frontage_width: minFrontageWidth,
            propertyType:
              spaceType.length > 0 ? JSON.stringify(spaceType) : undefined,
            min_daytime_pop: minDaytimePopulation,
            match_id: matchId,
          },
        })
      ).data;

      let rawMatchingPropertiesIds = rawMatchingProperties?.map(
        // eslint-disable-next-line @typescript-eslint/camelcase
        ({ space_id }) => space_id,
      );

      let prismaSpaceIds = (
        await context.prisma.space.findMany({
          where: {
            spaceId: {
              in: rawMatchingPropertiesIds,
            },
          },
        })
      ).map(({ spaceId }) => spaceId);
      let filteredMatchingProperties = rawMatchingProperties?.filter(
        // eslint-disable-next-line @typescript-eslint/camelcase
        ({ space_id }) => prismaSpaceIds.includes(space_id),
      );

      let savedPropertySpaceIds = (
        await context.prisma.savedProperty.findMany({
          where: {
            tenantUser: {
              id: context.tenantUserId,
            },
          },
        })
      ).map(({ spaceId }) => {
        return spaceId;
      });

      let newMatchingProperties = filteredMatchingProperties?.map(
        ({
          space_id: spaceId,
          property_id: propertyId,
          space_condition: spaceCondition,
          tenant_type: tenantType,
          match_value: matchValue,
          lng: numberLng,
          lat: numberLat,
          type,
          ...other
        }) => {
          return {
            spaceId,
            propertyId,
            spaceCondition,
            tenantType,
            type,
            matchValue,
            lng: numberLng.toString(),
            lat: numberLat.toString(),
            ...other,
            liked: savedPropertySpaceIds.includes(spaceId),
          };
        },
      );
      tenantId = newTenantId;
      matchId = newMatchId;
      matchingLocations = newMatchingLocations;
      matchingProperties = newMatchingProperties;
      await context.prisma.brand.update({
        where: { id: brandId },
        data: {
          matchingLocations: JSON.stringify(newMatchingLocations),
          matchingProperties: JSON.stringify(newMatchingProperties),
          tenantId,
          matchId,
        },
      });
    }

    return {
      id: brandId,
      matchId,
      tenantId,
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
      maxSize,
      newLocationPlan,
      spaceType,
      userRelation,
      minFrontageWidth,
      nextLocations,
    };
  },
});

export { tenantMatches };
