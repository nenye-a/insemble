import { objectType } from 'nexus';

export let PropertyMatchesThumbnail = objectType({
  name: 'PropertyMatchesThumbnail',
  definition(t) {
    t.string('brandId');
    t.string('matchId', { nullable: true });
    t.string('name');
    t.string('pictureUrl');
    t.string('category');
    t.int('numExistingLocations');
    t.float('matchValue');
    t.boolean('interested');
    t.boolean('onPlatform');
    t.field('contacts', {
      type: 'ReceiverContact',
      list: true,
    });
  },
});
