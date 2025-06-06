import { objectType } from 'nexus';

export let MatchingLocation = objectType({
  name: 'MatchingLocation',
  definition(t) {
    t.float('match');
    t.float('lng');
    t.float('lat');
  },
});
