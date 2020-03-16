import { objectType } from 'nexus';

export let GooglePlace = objectType({
  name: 'GooglePlace',
  definition(t) {
    t.string('id');
    t.string('formattedAddress');
    t.string('name');
    t.field('location', { type: GoogleLocation });
    t.field('viewport', { type: Viewport });
  },
});

export let Viewport = objectType({
  name: 'Viewport',
  definition(t) {
    t.field('northeast', { type: GoogleLocation });
    t.field('southwest', { type: GoogleLocation });
  },
});

export let GoogleLocation = objectType({
  name: 'GoogleLocation',
  definition(t) {
    t.string('lat');
    t.string('lng');
  },
});
