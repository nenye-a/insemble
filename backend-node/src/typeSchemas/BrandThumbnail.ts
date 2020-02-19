import { objectType } from 'nexus';

export let BrandThumbnail = objectType({
  name: 'BrandThumbnail',
  definition(t) {
    t.model('Brand').id();
    t.model('Brand').name();
    t.model('Brand').categories();
    t.field('matchingLocations', {
      type: 'MatchingLocation',
      list: true,
      nullable: true,
    });
  },
});
