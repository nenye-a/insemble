import { objectType } from 'nexus';

export let SavedProperty = objectType({
  name: 'SavedProperty',
  definition(t) {
    t.model.id();
    t.model.matchValue();
    t.model.spaceId();
    t.model.brandId();
    t.model.propertyId();
    t.string('address');
    t.int('rent');
    t.int('sqft');
    t.string('thumbnail');
  },
});
