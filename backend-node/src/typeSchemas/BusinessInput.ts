import { inputObjectType } from 'nexus';

export let FilterInput = inputObjectType({
  name: 'FilterInput',
  definition(t) {
    t.string('name');
    t.string('categories', { list: true });
    t.string('userRelation');
    t.int('locationCount');
    t.field('newLocationPlan', { type: 'NewLocationPlan' }); //enum
    t.field('location', { type: 'LocationInput' });
  },
});
