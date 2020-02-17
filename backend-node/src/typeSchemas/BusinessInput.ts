import { inputObjectType } from 'nexus';

export let BusinessInput = inputObjectType({
  name: 'BusinessInput',
  definition(t) {
    t.string('name');
    t.string('userRelation');
    t.int('locationCount');
    t.field('newLocationPlan', { type: 'NewLocationPlan' }); //enum
    t.field('location', { type: 'LocationInput' });
  },
});
