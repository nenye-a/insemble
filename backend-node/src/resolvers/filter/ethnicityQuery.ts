import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField } from 'nexus';
import { FilterOptions } from 'dataTypes';

let ethnicity = queryField('ethnicity', {
  type: 'RawFilter',
  list: true,
  resolve: ethnicityResolver,
});

// TODO: Add where args
async function ethnicityResolver(_: Root, _args: {}, _context: Context) {
  let { ethnicity }: FilterOptions = (
    await axios.get(`${LEGACY_API_URI}/api/filter/`)
  ).data;

  let ethnicityObjectList = ethnicity.map((rawValue) => {
    let splitEthnicityValue = rawValue.split('Population, ');
    return {
      rawValue,
      displayValue: splitEthnicityValue[1],
    };
  });

  return ethnicityObjectList;
}

export { ethnicity };
