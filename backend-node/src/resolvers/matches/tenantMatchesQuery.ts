import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField, arg } from 'nexus';
import { TenantMatchesType } from 'dataTypes';

type MatchingLocation = {
  loc_id: string;
  lat: number;
  lng: number;
  match: number;
};

let tenantMatches = queryField('tenantMatches', {
  type: 'TenantMatchesResult',
  args: {
    brandId: arg({ type: 'String', required: true }),
  },
  resolve: async (_: Root, { brandId }, context: Context) => {
    let selectedBrand = await context.prisma.brand.findOne({
      where: { id: brandId },
      include: {
        location: true,
        matchingProperties: true,
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
      matchingProperties: existMatchingProperties,
      // NOTE: Unused filter params, will use later!
      equipmentIds,
      locationCount,
      minSize,
      maxSize,
      newLocationPlan,
      spaceType,
      userRelation,
    } = selectedBrand;

    if (!(name && location) && !(categories.length > 0 && minIncome)) {
      throw new Error(
        'Please update your brand and provide either (address and brand_name) or (categories and income)',
      );
    }

    if (matchingLocationsJSON) {
      let existMatchingLocations: Array<MatchingLocation> = JSON.parse(
        matchingLocationsJSON,
      );

      return {
        status: 200,
        statusDetail: 'Success',
        matchingLocations: existMatchingLocations,
        matchingProperties: existMatchingProperties,
        selectedFilter: {
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
          minRent,
          maxRent,
          equipmentIds,
          locationCount,
          minSize,
          maxSize,
          newLocationPlan,
          spaceType,
          userRelation,
        },
      };
    }

    let {
      matching_locations: newMatchingLocations,
      status,
      status_detail: statusDetail,
      matching_properties: newMatchingProperties,
    }: TenantMatchesType = (
      await axios.get(`${LEGACY_API_URI}/api/tenantMatches`, {
        params: {
          address: location?.address,
          brand_name: name,
          categories: categories,
          income: minIncome && {
            min: maxIncome,
            max: maxIncome,
          },
          age: minAge && {
            min: minAge,
            max: maxAge,
          },
          personas: personas,
          commute: commute,
          education: education,
          rent: minRent && {
            min: minRent,
            max: maxRent,
          },
        },
      })
    ).data;
    return {
      status,
      statusDetail,
      matchingLocations: newMatchingLocations,
      matchingProperties: newMatchingProperties,
      selectedFilter: {
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
        minRent,
        maxRent,
        equipmentIds,
        locationCount,
        minSize,
        maxSize,
        newLocationPlan,
        spaceType,
        userRelation,
      },
    };
  },
});

export { tenantMatches };
