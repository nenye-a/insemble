import { objectType } from 'nexus';

export let PropertyMatchesThumbnail = objectType({
  name: 'PropertyMatchesThumbnail',
  definition(t) {
    t.string('brandId');
    t.string('name');
    t.string('pictureUrl');
    t.string('category');
    t.int('numExistingLocations');
    t.int('matchValue');
    t.boolean('interested');
    t.boolean('verified');
    t.boolean('claimed');
    t.boolean('matchesTenantType');
    t.boolean('exclusivityRisk');
  },
});
