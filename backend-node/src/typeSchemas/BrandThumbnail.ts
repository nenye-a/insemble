import { objectType } from 'nexus';

export let BrandThumbnail = objectType({
  name: 'BrandThumbnail',
  definition(t) {
    t.model('Brand').id();
    t.model('Brand').name();
    t.model('Brand').categories();
    t.model('Brand').nextLocations();
    t.model('Brand').newLocationPlan();
    t.model('Brand').locationCount();
    t.model('Brand').location();
    t.field('matchingLocations', {
      type: 'MatchingLocation',
      list: true,
      nullable: true,
    });
    t.boolean('locked');
  },
});
