/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';
import { queryField, arg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import {
  TenantMatchesType,
  MatchingLocation,
  MatchingProperty,
} from 'dataTypes';
import { axiosParamsSerializer } from '../../helpers/axiosParamsCustomSerializer';
import { trialCheck } from '../../helpers/trialCheck';

type PendingData = {
  location?: {
    address: string;
    lat: string;
    lng: string;
  };
  nextLocations?: Array<{
    address: string;
    lat: string;
    lng: string;
  }>;
  education?: Array<string>;
  commute?: Array<string>;
  ethnicity?: Array<string>;
  categories?: Array<string>;
  equipment?: Array<string>;
  maxAge?: number;
  maxIncome?: number;
  maxRent?: number;
  maxSize?: number;
  minAge?: number;
  minDaytimePopulation?: number;
  minFrontageWidth?: number;
  minIncome?: number;
  minRent?: number;
  minSize?: number;
  personas?: Array<string>;
  spaceType?: Array<string>;
  locationCount?: number;
  name?: string;
  newLocationPlan?: 'NOT_ACTIVE' | 'NOT_PLANNING' | 'YES';
  userRelation?: string;
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
        nextLocations: true,
        tenantUser: { include: { brands: { orderBy: { id: 'desc' } } } },
      },
    });
    if (!selectedBrand) {
      throw new Error('Brand not found!');
    }
    let tenantUser = selectedBrand.tenantUser;
    if (!tenantUser) {
      throw new Error('Tenant not found in this brand.');
    }
    if (tenantUser.id !== context.tenantUserId) {
      throw new Error('This is not your brand. Not Authorized!');
    }

    let isTrial = trialCheck(tenantUser.createdAt);
    if (!isTrial) {
      if (tenantUser.tier !== 'FREE' && !tenantUser.stripeSubscriptionId) {
        tenantUser = await context.prisma.tenantUser.update({
          where: { id: context.tenantUserId },
          data: { tier: 'FREE' },
          include: { brands: { orderBy: { id: 'desc' } } },
        });
      }
    }

    if (tenantUser.tier === 'FREE') {
      let latestBrandIndex = 0;
      let selectedBrandIndex = tenantUser.brands.findIndex(
        ({ id }) => id === brandId,
      );
      if (latestBrandIndex !== selectedBrandIndex) {
        throw new Error(
          'Free tier can only edit latest brand. Upgrade to professional if you want to update.',
        );
      }
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
      // NOTE: data for update Matches
      pendingUpdate,
    } = selectedBrand;
    if (!(name && location) && !(categories.length > 0 && minIncome)) {
      throw new Error(
        'Please update your brand and provide either (address and brand_name) or (categories and income)',
      );
    }
    let matchingLocations;
    let matchingProperties;
    if (pendingUpdate) {
      try {
        let {
          categories: pendingCategories,
          commute: pendingCommute,
          education: pendingEducation,
          ethnicity: pendingEthnicity,
          location: pendingLocation,
          name: pendingName,
          maxIncome: pendingMaxIncome,
          minIncome: pendingMinIncome,
          minAge: pendingMinAge,
          maxAge: pendingMaxAge,
          personas: pendingPersonas,
          minRent: pendingMinRent,
          maxRent: pendingMaxRent,
          minSize: pendingMinSize,
          maxSize: pendingMaxSize,
          minDaytimePopulation: pendingMinDaytimePopulation,
          minFrontageWidth: pendingMinFrontageWidth,
          spaceType: pendingSpaceType,
          equipment: pendingEquipment,
          locationCount: pendingLocationCount,
          newLocationPlan: pendingNewLocationPlan,
          userRelation: pendingUserRelation,
          nextLocations: pendingNextLocations,
        }: PendingData = JSON.parse(pendingUpdate);
        pendingCategories = pendingCategories || categories;
        pendingPersonas = pendingPersonas || personas;
        pendingCommute = pendingCommute || commute;
        pendingEducation = pendingEducation || education;
        pendingEthnicity = pendingEthnicity || ethnicity;
        pendingEquipment = pendingEquipment || equipment;
        pendingSpaceType = pendingSpaceType || spaceType;

        let {
          brand_id: newTenantId,
          match_id: newMatchId,
          matching_locations: newMatchingLocations,
          matching_properties: rawMatchingProperties = [],
        }: TenantMatchesType = (
          await axios.get(`${LEGACY_API_URI}/api/tenantMatches/`, {
            params: {
              address: pendingLocation?.address || location?.address,
              brand_name: pendingName || name,
              categories:
                pendingCategories.length > 0
                  ? JSON.stringify(pendingCategories)
                  : undefined,
              income:
                typeof pendingMinIncome === 'number' ||
                typeof minIncome === 'number'
                  ? {
                      min: pendingMinIncome || minIncome,
                      max: pendingMaxIncome || maxIncome,
                    }
                  : undefined,
              age:
                typeof pendingMinAge === 'number' || typeof minAge === 'number'
                  ? {
                      min: pendingMinAge || minAge,
                      max: pendingMaxAge || maxAge,
                    }
                  : undefined,
              personas:
                pendingPersonas.length > 0
                  ? JSON.stringify(pendingPersonas)
                  : undefined,
              commute:
                pendingCommute.length > 0
                  ? JSON.stringify(pendingCommute)
                  : undefined,
              education:
                pendingEducation.length > 0
                  ? JSON.stringify(pendingEducation)
                  : undefined,
              ethnicity:
                pendingEthnicity.length > 0
                  ? JSON.stringify(pendingEthnicity)
                  : undefined,
              rent:
                typeof pendingMinRent === 'number' ||
                typeof minRent === 'number'
                  ? {
                      min: pendingMinRent || minRent,
                      max: pendingMaxRent || maxRent,
                    }
                  : undefined,
              sqft:
                typeof pendingMinSize === 'number' ||
                typeof minSize === 'number'
                  ? {
                      min: pendingMinSize || minSize,
                      max: pendingMaxSize || maxSize,
                    }
                  : undefined,
              frontage_width: pendingMinFrontageWidth || minFrontageWidth,
              propertyType:
                pendingSpaceType.length > 0
                  ? JSON.stringify(pendingSpaceType)
                  : undefined,
              min_daytime_pop:
                pendingMinDaytimePopulation || minDaytimePopulation,
              match_id: matchId,
            },
            paramsSerializer: axiosParamsSerializer,
          })
        ).data;

        let rawMatchingPropertiesIds = rawMatchingProperties?.map(
          ({ space_id }) => space_id,
        );

        let spaces = await context.prisma.space.findMany({
          where: {
            spaceId: {
              in: rawMatchingPropertiesIds,
            },
          },
        });

        let spacesMap = new Map(
          spaces.map(({ spaceId, ...rest }) => [spaceId, rest]),
        );
        let prismaSpaceIds = [...spacesMap.keys()];
        let filteredMatchingProperties = rawMatchingProperties?.filter(
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
              thumbnail: spacesMap.get(spaceId)?.mainPhoto || '',
              lng: numberLng.toString(),
              lat: numberLat.toString(),
              ...other,
              liked: savedPropertySpaceIds.includes(spaceId),
            };
          },
        );
        let newBrand = await context.prisma.brand.update({
          where: { id: brandId },
          data: {
            name: pendingName,
            maxIncome: pendingMaxIncome,
            minIncome: pendingMinIncome,
            minAge: pendingMinAge,
            maxAge: pendingMaxAge,
            minRent: pendingMinRent,
            maxRent: pendingMaxRent,
            minSize: pendingMinSize,
            maxSize: pendingMaxSize,
            minDaytimePopulation: pendingMinDaytimePopulation,
            minFrontageWidth: pendingMinFrontageWidth,
            locationCount: pendingLocationCount,
            newLocationPlan: pendingNewLocationPlan,
            userRelation: pendingUserRelation,
            nextLocations: pendingNextLocations
              ? {
                  create: pendingNextLocations,
                }
              : undefined,
            categories: pendingCategories
              ? {
                  set: pendingCategories,
                }
              : undefined,
            equipment: pendingEquipment
              ? {
                  set: pendingEquipment,
                }
              : undefined,
            personas: pendingPersonas
              ? {
                  set: pendingPersonas,
                }
              : undefined,
            spaceType: pendingSpaceType
              ? {
                  set: pendingSpaceType,
                }
              : undefined,
            education: pendingEducation
              ? {
                  set: pendingEducation,
                }
              : undefined,
            commute: pendingCommute
              ? {
                  set: pendingCommute,
                }
              : undefined,
            ethnicity: pendingEthnicity
              ? {
                  set: pendingEthnicity,
                }
              : undefined,
            location: pendingLocation
              ? {
                  update: pendingLocation,
                }
              : undefined,
            matchingLocations: JSON.stringify(newMatchingLocations),
            matchingProperties: JSON.stringify(newMatchingProperties),
            tenantId,
            matchId,
            pendingUpdate: null,
          },
          include: {
            location: true,
            nextLocations: true,
          },
        });

        // NOTE: Redeclare for return
        categories = newBrand.categories;
        location = newBrand.location;
        name = newBrand.name;
        maxIncome = newBrand.maxIncome;
        minIncome = newBrand.minIncome;
        minAge = newBrand.minAge;
        maxAge = newBrand.maxAge;
        personas = newBrand.personas;
        commute = newBrand.commute;
        education = newBrand.education;
        minRent = newBrand.minRent;
        maxRent = newBrand.maxRent;
        minSize = newBrand.minSize;
        maxSize = newBrand.maxSize;
        minDaytimePopulation = newBrand.minDaytimePopulation;
        minFrontageWidth = newBrand.minFrontageWidth;
        spaceType = newBrand.spaceType;
        equipment = newBrand.equipment;
        ethnicity = newBrand.ethnicity;
        locationCount = newBrand.locationCount;
        newLocationPlan = newBrand.newLocationPlan;
        userRelation = newBrand.userRelation;
        nextLocations = newBrand.nextLocations;

        tenantId = newTenantId;
        matchId = newMatchId;
        matchingLocations = newMatchingLocations;
        matchingProperties = newMatchingProperties;
      } catch {
        await context.prisma.brand.update({
          data: {
            pendingUpdate: null,
          },
          where: {
            id: brandId,
          },
        });
        throw new Error(
          'Failed to Load Heatmap, please adjust settings and try again.',
        );
      }
    } else if (matchingLocationsJSON) {
      let existMatchingLocations: Array<MatchingLocation> = JSON.parse(
        matchingLocationsJSON,
      );
      let existMatchingProperties: Array<MatchingProperty> = matchingPropertiesJSON
        ? JSON.parse(matchingPropertiesJSON)
        : [];
      matchingProperties = existMatchingProperties;
      matchingLocations = existMatchingLocations;
    } else {
      try {
        // NOTE: By new logic this only run when first time create brand
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
              income:
                typeof minIncome === 'number'
                  ? {
                      min: minIncome,
                      max: maxIncome,
                    }
                  : undefined,
              age:
                typeof minAge === 'number'
                  ? {
                      min: minAge,
                      max: maxAge,
                    }
                  : undefined,
              personas:
                personas.length > 0 ? JSON.stringify(personas) : undefined,
              commute: commute.length > 0 ? JSON.stringify(commute) : undefined,
              education:
                education.length > 0 ? JSON.stringify(education) : undefined,
              ethnicity:
                ethnicity.length > 0 ? JSON.stringify(ethnicity) : undefined,
              rent:
                typeof minRent === 'number'
                  ? {
                      min: minRent,
                      max: maxRent,
                    }
                  : undefined,
              sqft:
                typeof minSize === 'number'
                  ? {
                      min: minSize,
                      max: maxSize,
                    }
                  : undefined,
              frontage_width: minFrontageWidth,
              propertyType:
                spaceType.length > 0 ? JSON.stringify(spaceType) : undefined,
              min_daytime_pop: minDaytimePopulation,
              match_id: matchId,
            },
            paramsSerializer: axiosParamsSerializer,
          })
        ).data;

        let rawMatchingPropertiesIds = rawMatchingProperties?.map(
          ({ space_id }) => space_id,
        );

        let spaces = await context.prisma.space.findMany({
          where: {
            spaceId: {
              in: rawMatchingPropertiesIds,
            },
          },
        });

        let spacesMap = new Map(
          spaces.map(({ spaceId, ...rest }) => [spaceId, rest]),
        );
        let prismaSpaceIds = [...spacesMap.keys()];
        let filteredMatchingProperties = rawMatchingProperties?.filter(
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
              thumbnail: spacesMap.get(spaceId)?.mainPhoto || '',
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
      } catch {
        throw new Error('Failed to Load Heatmap, please try again.');
      }
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
