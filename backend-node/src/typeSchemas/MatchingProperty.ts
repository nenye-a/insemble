import { objectType } from 'nexus';

export let MatchingProperty = objectType({
  name: 'MatchingProperty',
  definition(t) {
    t.string('address');
    t.int('rent', { nullable: true });
    t.int('sqft');
    t.string('type', { list: true });
    t.string('spaceId');
    t.string('spaceCondition', { list: true });
    t.string('tenantType', { list: true });
    t.boolean('pro');
    t.boolean('visible');
    t.string('lat');
    t.string('lng');
    t.float('matchValue');
  },
});
