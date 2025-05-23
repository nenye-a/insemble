import { inputObjectType } from 'nexus';

export let BusinessInput = inputObjectType({
  name: 'BusinessInput',
  definition(t) {
    t.string('name');
    t.field('location', { type: 'LocationInput' });
    t.string('userRelation');
    t.int('locationCount');
    t.field('newLocationPlan', { type: 'NewLocationPlan' }); //enum
    t.field('nextLocations', { type: 'LocationInput', list: true });
  },
});
