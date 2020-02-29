import { objectType } from 'nexus';

export let Space = objectType({
  name: 'Space',
  definition(t) {
    t.model.id();
    t.string('available');
    t.model.equipment();
    t.model.photos();
    t.model.condition();
    t.model.sqft();
    t.model.pricePerSqft();
    t.model.mainPhoto();
    t.model.description();
  },
});
