import { objectType } from 'nexus';

export let Space = objectType({
  name: 'Space',
  definition(t) {
    t.model.id();
    t.model.spaceId();
    t.model.available();
    t.model.equipment();
    t.model.photos();
    t.model.condition();
    t.model.sqft();
    t.model.pricePerSqft();
    t.model.mainPhoto();
    t.model.description();
    t.model.spaceType();
    t.model.marketingPreference();
  },
});
