import { objectType } from 'nexus';

export let PropertyMatchesPolling = objectType({
  name: 'PropertyMatchesPolling',
  definition(t) {
    t.boolean('polling');
    t.string('error', { nullable: true });
    t.field('data', {
      type: 'PropertyMatchesThumbnail',
      list: true,
      nullable: true,
    });
  },
});
