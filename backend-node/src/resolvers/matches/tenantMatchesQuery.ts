import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField, arg } from 'nexus';
import { TenantMatchesType } from 'dataTypes';

let tenantMatches = queryField('tenantMatches', {
  type: 'TenantMatchesResult',
  args: {
    business: arg({ type: 'BusinessInput' }),
    filter: arg({ type: 'FilterInput' }),
    optionalFilter: arg({ type: 'OptionalFilterInput' }),
  },
  resolve: async (
    _: Root,
    { business, filter, optionalFilter },
    _context: Context,
  ) => {
    if (!business && !filter) {
      throw new Error(
        'Please provide either (address and brand_name) or (categories and income)',
      );
    }
    let {
      matching_locations: matchingLocationsRaw,
      status,
      status_detail: statusDetail,
      matching_properties: matchingProperties,
    }: TenantMatchesType = (
      await axios.get(`${LEGACY_API_URI}/api/tenantMatches`, {
        params: {
          address: business?.location.address,
          brand_name: business?.name,
          categories: filter?.categories,
          income: filter?.minIncome && {
            min: filter?.maxIncome,
            max: filter?.maxIncome,
          },
          age: optionalFilter?.minAge && {
            min: optionalFilter?.minAge,
            max: optionalFilter?.maxAge,
          },
          personas: optionalFilter?.personas,
          commute: optionalFilter?.commute,
          education: optionalFilter?.education,
          rent: optionalFilter?.minRent && {
            min: optionalFilter?.minRent,
            max: optionalFilter?.maxRent,
          },
        },
      })
    ).data;
    let matchingLocations =
      matchingLocationsRaw &&
      matchingLocationsRaw.map(({ loc_id: id, ...rest }) => {
        return { id, ...rest };
      });
    if (business) {
      // TODO: save to database also check token to determine User
    }
    return {
      status,
      statusDetail,
      matchingLocations,
      matchingProperties,
    };
  },
});

// TODO:

export { tenantMatches };
