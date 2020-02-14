import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField } from 'nexus';
import { FilterOptions } from 'dataTypes';

let education = queryField('education', {
  type: 'RawFilter',
  list: true,
  resolve: educationResolver,
});

// TODO: Add where args
async function educationResolver(_: Root, _args: {}, _context: Context) {
  let { education }: FilterOptions = (
    await axios.get(`${LEGACY_API_URI}/api/filter`)
  ).data;
  let educationObjectList = education.map((rawValue) => {
    let splitEducationValue = rawValue.split('+, ');
    return {
      rawValue,
      displayValue: splitEducationValue[1],
    };
  });

  return educationObjectList;
}

export { education };
