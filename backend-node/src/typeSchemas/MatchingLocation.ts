import { objectType } from 'nexus';

export let MatchingLocation = objectType({
  name: 'MatchingLocation',
  definition(t) {
    t.id('loc_id');
    t.float('match');
    t.float('lng');
    t.float('lat');
  },
});
