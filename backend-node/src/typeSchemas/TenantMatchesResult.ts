import { objectType } from 'nexus';

export let TenantMatchesResult = objectType({
  name: 'TenantMatchesResult',
  definition(t) {
    t.int('status');
    t.string('statusDetail');
    t.field('matchingLocations', {
      type: 'MatchingLocation',
      list: true,
      nullable: true,
    });
    t.field('matchingProperties', {
      type: 'MatchingProperty',
      list: true,
      nullable: true,
    });
  },
});
