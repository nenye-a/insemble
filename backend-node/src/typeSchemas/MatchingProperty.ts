import { objectType } from 'nexus';

export let MatchingProperty = objectType({
  name: 'MatchingProperty',
  definition(t) {
    t.string('address');
    t.int('rent');
    t.int('sqft');
    t.string('type');
  },
});
