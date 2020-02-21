import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField } from 'nexus';
import { FilterOptions } from 'dataTypes';

let commute = queryField('commute', {
  type: 'RawFilter',
  list: true,
  resolve: commuteResolver,
});

// TODO: Add where args
async function commuteResolver(_: Root, _args: {}, _context: Context) {
  let { commute }: FilterOptions = (
    await axios.get(`${LEGACY_API_URI}/api/filter/`)
  ).data;
  let commuteObjectList = commute.map((rawValue) => {
    let splitCommuteValue = rawValue.split(': ');
    return {
      rawValue,
      displayValue: splitCommuteValue[1],
    };
  });

  return commuteObjectList;
}

export { commute };
