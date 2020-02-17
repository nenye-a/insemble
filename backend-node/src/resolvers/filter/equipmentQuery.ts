import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';

let equipmentsResolver: FieldResolver<'Query', 'equipments'> = async (
  _: Root,
  _args,
  _context: Context,
) => {
  return [
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
