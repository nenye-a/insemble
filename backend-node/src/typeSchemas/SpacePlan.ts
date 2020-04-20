import { objectType } from 'nexus';

export let SpacePlan = objectType({
  name: 'SpacePlan',
  definition(t) {
    t.model('Space').id();
    t.model('Space').tier();
    t.model('Space').mainPhoto();
    t.field('location', { type: 'Location' });
    t.int('spaceIndex');
    t.string('cost');
    t.date('canceledAt', { nullable: true });
  },
});
