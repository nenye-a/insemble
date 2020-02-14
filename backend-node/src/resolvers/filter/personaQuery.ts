import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField } from 'nexus';
import { FilterOptions } from 'dataTypes';

let personas = queryField('personas', {
  type: 'String',
  list: true,
  resolve: personaResolver,
});

// TODO: Add where args
async function personaResolver(_: Root, _args: {}, _context: Context) {
  let { personas }: FilterOptions = (
    await axios.get(`${LEGACY_API_URI}/api/filter`)
  ).data;

  return personas;
}

export { personas };
