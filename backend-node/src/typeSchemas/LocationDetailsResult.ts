import { objectType } from 'nexus';

export let AffinitiesDeepDive = objectType({
  name: 'AffinitiesDeepDive',
  definition(t) {
    t.boolean('growth');
    t.boolean('personas');
    t.boolean('demographics');
    t.boolean('ecosystem');
  },
});

export let KeyFactsDeepDive = objectType({
  name: 'KeyFactsDeepDive',
  definition(t) {
    t.int('mile', { nullable: true });
    t.float('daytimePop', { nullable: true });
    t.float('mediumHouseholdIncome', { nullable: true });
    t.float('totalHousehold', { nullable: true });
    t.float('householdGrowth2017to2022', { nullable: true });
    t.int('numMetro', { nullable: true });
    t.int('numUniversities', { nullable: true });
    t.int('numHospitals', { nullable: true });
    t.int('numApartements', { nullable: true });
  },
});

export let CommuteDeepDive = objectType({
  name: 'CommuteDeepDive',
  definition(t) {
    t.string('name');
    t.int('value');
  },
});

export let PersonaDeepDive = objectType({
  name: 'PersonaDeepDive',
  definition(t) {
    t.float('percentile');
    t.string('name');
    t.string('description');
    t.string('photo');
    t.string('tags', { list: true });
  },
});

export let DemographicStat = objectType({
  name: 'DemographicStat',
  definition(t) {
    t.string('name');
    t.float('myLocation', { nullable: true });
    t.float('targetLocation', { nullable: true });
    t.float('growth', { nullable: true });
  },
});

export let DemographicPropertyStat = objectType({
  name: 'DemographicPropertyStat',
  definition(t) {
    t.string('name');
    t.float('myLocation');
  },
});

export let DemographicProperty = objectType({
  name: 'DemographicProperty',
  definition(t) {
    t.field('age', {
      type: 'DemographicPropertyStat',
      list: true,
    });
    t.field('income', {
      type: 'DemographicPropertyStat',
      list: true,
    });
    t.field('ethnicity', {
      type: 'DemographicPropertyStat',
      list: true,
    });
    t.field('education', {
      type: 'DemographicPropertyStat',
      list: true,
    });
    t.field('gender', {
      type: 'DemographicPropertyStat',
      list: true,
    });
  },
});

export let DemographicDeepDive = objectType({
  name: 'DemographicDeepDive',
  definition(t) {
    t.field('age', {
      type: 'DemographicStat',
      list: true,
    });
    t.field('income', {
      type: 'DemographicStat',
      list: true,
    });
    t.field('ethnicity', {
      type: 'DemographicStat',
      list: true,
    });
    t.field('education', {
      type: 'DemographicStat',
      list: true,
    });
    t.field('gender', {
      type: 'DemographicStat',
      list: true,
    });
  },
});

export let NearbyDeepDive = objectType({
  name: 'NearbyDeepDive',
  definition(t) {
    t.float('lat');
    t.float('lng');
    t.string('name');
    t.float('rating', { nullable: true });
    t.float('numberRating');
    t.string('category');
    t.float('distance');
    t.string('placeType', { list: true });
    t.boolean('similar');
  },
});

export let DeepDiveResultType = objectType({
  name: 'DeepDiveResultType',
  definition(t) {
    t.float('matchValue');
    t.field('affinities', {
      type: 'AffinitiesDeepDive',
    });
    t.field('keyFacts', {
      type: 'KeyFactsDeepDive',
    });
    t.field('commute', {
      type: 'CommuteDeepDive',
      nullable: true,
      list: true,
    });
    t.field('topPersonas', {
      type: 'PersonaDeepDive',
      nullable: true,
      list: true,
    });
    t.field('demographics1', {
      type: 'DemographicDeepDive',
      nullable: true,
    });
    t.field('demographics3', {
      type: 'DemographicDeepDive',
      nullable: true,
    });
    t.field('demographics5', {
      type: 'DemographicDeepDive',
      nullable: true,
    });
    t.field('nearby', {
      type: 'NearbyDeepDive',
      nullable: true,
      list: true,
    });
  },
});

export let SummaryPropDetails = objectType({
  name: 'SummaryPropDetails',
  definition(t) {
    t.int('pricePerSqft');
    t.string('type', { list: true });
    t.string('condition');
  },
});

export let SpaceDetails = objectType({
  name: 'SpaceDetails',
  definition(t) {
    t.string('spaceId');
    t.string('tour3D', { nullable: true });
    t.string('mainPhoto');
    t.int('sqft');
    t.string('photos', { list: true });
    t.field('summary', {
      type: 'SummaryPropDetails',
    });
    t.string('description');
    t.boolean('liked');
  },
});

export let LocationDetailsResult = objectType({
  name: 'LocationDetailsResult',
  definition(t) {
    t.field('result', {
      type: 'DeepDiveResultType',
    });
    t.field('spaceDetails', {
      type: 'SpaceDetails',
      list: true,
    });
  },
});
