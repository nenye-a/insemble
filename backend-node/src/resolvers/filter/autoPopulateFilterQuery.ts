import { queryField, stringArg, FieldResolver } from 'nexus';
import axios from 'axios';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { AutoPopulateResponse } from 'dataTypes';

let autoPopulateFilterResolver: FieldResolver<
  'Query',
  'autoPopulateFilter'
> = async (_: Root, { address, brandName }, _context: Context) => {
  let autoPopulateResponse: AutoPopulateResponse = (
    await axios.get(`${LEGACY_API_URI}/api/autoPopulate`, {
      params: {
        address: address,
        brand_name: brandName,
      },
    })
  ).data;

  return autoPopulateResponse;
};

let autoPopulateFilter = queryField('autoPopulateFilter', {
  type: 'AutoPopulate',
  args: {
    address: stringArg(),
    brandName: stringArg(),
  },
  resolve: autoPopulateFilterResolver,
});

export { autoPopulateFilter };
