import { objectType } from 'nexus';

export let Brand = objectType({
  name: 'Brand',
  definition(t) {
    t.model.id();
    t.model.name();
    t.field('location', { type: 'Location', nullable: true });
    t.model.userRelation();
    t.model.locationCount();
    t.field('nextLocations', { type: 'Location', list: true, nullable: true });
    t.model.newLocationPlan();
    t.model.minIncome();
    t.model.maxIncome();
    t.model.categories();
    t.model.minAge();
    t.model.maxAge();
    t.model.minSize();
    t.model.maxSize();
    t.model.minRent();
    t.model.maxRent();
    t.model.minFrontageWidth();
    t.model.maxFrontageWidth();
    t.field('education', { type: 'RawFilter', list: true, nullable: true });
    t.field('commute', { type: 'RawFilter', list: true, nullable: true });
    t.model.personas();
    t.model.equipmentIds();
    t.model.spaceType();
    t.field('matchingLocations', {
      type: 'MatchingLocation',
      list: true,
      nullable: true,
    });
    t.field('matchingProperties', {
      type: 'MatchingProperty',
      list: true,
      nullable: true,
    });
  },
});
