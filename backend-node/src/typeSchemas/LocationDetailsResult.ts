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
    t.int('mile');
    t.float('daytimePop');
    t.float('mediumHouseholdIncome');
    t.float('totalHousehold');
    t.float('householdGrowth2017to2022');
    t.int('numMetro');
    t.int('numUniversities');
    t.int('numHospitals');
    t.int('numApartements');
  },
});

export let CommuteDeepDive = objectType({
  name: 'CommuteDeepDive',
  definition(t) {
    t.int('publicTransport');
    t.int('bicycle');
    t.int('carpooled');
    t.int('droveAlone');
    t.int('walked');
    t.int('workAtHome');
  },
});

export let PersonaDeepDive = objectType({
  name: 'PersonaDeepDive',
  definition(t) {
    t.float('percentile');
    t.string('name');
    t.string('description');
    t.string('tags', { list: true });
  },
});

export let DemographicStat = objectType({
  name: 'DemographicStat',
  definition(t) {
    t.string('name');
    t.float('myLocation', { nullable: true });
    t.float('targetLocation');
    t.float('growth', { nullable: true });
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
    t.boolean('restaurant', { nullable: true });
    t.boolean('retail', { nullable: true });
    t.boolean('similar');
    t.boolean('hospital', { nullable: true });
    t.boolean('apartment', { nullable: true });
    t.boolean('metro', { nullable: true });
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
    });
    t.field('topPersonas', {
      type: 'PersonaDeepDive',
      list: true,
    });
    t.field('demographics1', {
      type: 'DemographicDeepDive',
    });
    t.field('demographics3', {
      type: 'DemographicDeepDive',
    });
    t.field('demographics5', {
      type: 'DemographicDeepDive',
    });
    t.field('nearby', {
      type: 'NearbyDeepDive',
      list: true,
    });
  },
});

export let SummaryPropDetails = objectType({
  name: 'SummaryPropDetails',
  definition(t) {
    t.int('pricePerSqft');
    t.string('type');
    t.string('condition');
  },
});

export let PropertyDetails = objectType({
  name: 'PropertyDetails',
  definition(t) {
    t.string('tour3D', { nullable: true });
    t.string('mainPhoto');
    t.int('sqft');
    t.string('photos', { list: true });
    t.field('summary', {
      type: 'SummaryPropDetails',
    });
    t.string('description');
  },
});

export let LocationDetailsResult = objectType({
  name: 'LocationDetailsResult',
  definition(t) {
    t.field('result', {
      type: 'DeepDiveResultType',
    });
    t.field('propertyDetails', {
      type: 'PropertyDetails',
      nullable: true,
    });
  },
});
