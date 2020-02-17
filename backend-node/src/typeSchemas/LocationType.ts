import { objectType } from 'nexus';

export let LocationType = objectType({
  name: 'LocationType',
  definition(t) {
    t.string('address');
    t.string('lat');
    t.string('lng');
  },
});
