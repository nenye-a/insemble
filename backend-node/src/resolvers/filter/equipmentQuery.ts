import axios from 'axios';
import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { FilterOptions } from 'dataTypes';

let equipmentsResolver: FieldResolver<'Query', 'equipments'> = async (
  _: Root,
  _args,
  _context: Context,
) => {
  let { equipment }: FilterOptions = (
    await axios.get(`${LEGACY_API_URI}/api/filter/`)
  ).data;

  return equipment
    ? equipment
    : [
        'chair',
        'table',
        'desk',
        'clock',
        'lamp',
        'cabinet',
        'fridge',
        'heater',
        'curtains',
        'couch',
      ];
};

let equipments = queryField('equipments', {
  type: 'String',
  list: true,
  resolve: equipmentsResolver,
});

export { equipments };
