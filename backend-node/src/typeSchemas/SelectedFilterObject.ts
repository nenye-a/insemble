import { objectType } from 'nexus';

export let Brand = objectType({
  name: 'Brand',
  definition(t) {
    t.model.name();
    t.model.location({ type: 'LocationType' });
    t.model.userRelation();
    t.model.locationCount();
    t.model.nextLocations({ type: 'LocationType' });
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
  },
});

// export let SelectedFilter = objectType({
//   name: 'SelectedFilter',
//   definition(t) {
//     t.string('name', { nullable: true });
//     t.field('location', { type: 'LocationType', nullable: true });
//     t.string('userRelation');
//     t.int('locationCount');
//     t.field('newLocationPlan', { type: 'NewLocationPlan' }); //enum
//     t.field('nextLocation', { type: 'LocationType', list: true });
//     t.int('minIncome', { nullable: true });
//     t.int('maxIncome', { nullable: true });
//     t.string('categories', { list: true, nullable: true });
//     t.int('minAge', { nullable: true });
//     t.int('maxAge', { nullable: true });
//     t.int('minSize', { nullable: true });
//     t.int('maxSize', { nullable: true });
//     t.int('minFrontageWidth', { nullable: true });
//     t.int('maxFrontageWidth', { nullable: true });
//     t.int('minRent', { nullable: true });
//     t.int('maxRent', { nullable: true });
//     t.field('education', { type: 'RawFilter', list: true, nullable: true });
//     t.field('commute', { type: 'RawFilter', list: true, nullable: true });
//     t.string('personas', { list: true, nullable: true });
//     t.string('equipmentIds', { list: true, nullable: true });
//     t.string('spaceType', { list: true, nullable: true });
//   },
// });
