import { objectType } from 'nexus';

export let SavedProperty = objectType({
  name: 'SavedProperty',
  definition(t) {
    t.model.id();
    t.model.address();
    t.model.matchValue();
    t.model.rent();
    t.model.spaceId();
    t.model.sqft();
    t.model.thumbnail();
  },
});
