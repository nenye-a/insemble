import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField } from 'nexus';
import { FilterOptions } from 'dataTypes';

let spaceType = queryField('spaceType', {
  type: 'String',
  list: true,
  resolve: spaceTypeResolver,
});

// TODO: Add where args
async function spaceTypeResolver(_: Root, _args: {}, _context: Context) {
  let { type }: FilterOptions = (
    await axios.get(`${LEGACY_API_URI}/api/filter/`)
  ).data;

  return type;
}

export { spaceType };
