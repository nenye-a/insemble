import { objectType } from 'nexus';

export let AffinitiesOverview = objectType({
  name: 'AffinitiesOverview',
  definition(t) {
    t.boolean('growth');
    t.boolean('personas');
    t.boolean('demographics');
    t.boolean('ecosystem');
  },
});

export let KeyFactsOverview = objectType({
  name: 'KeyFactsOverview',
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

export let CommuteOverview = objectType({
  name: 'CommuteOverview',
  definition(t) {
    t.int('publicTransport');
    t.int('bicycle');
    t.int('carpooled');
    t.int('droveAlone');
    t.int('walked');
    t.int('workAtHome');
  },
});

export let PersonaOverview = objectType({
  name: 'PersonaOverview',
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
    t.float('myLoaction', { nullable: true });
    t.float('targetLocation');
    t.float('growth', { nullable: true });
  },
});

export let AgeDemographic = objectType({
  name: 'AgeDemographic',
  definition(t) {
    t.field('under18', {
      type: 'DemographicStat',
    });
    t.field('between18To24', {
      type: 'DemographicStat',
    });
    t.field('between25To34', {
      type: 'DemographicStat',
    });
    t.field('between35To44', {
      type: 'DemographicStat',
    });
    t.field('between45To54', {
      type: 'DemographicStat',
    });
    t.field('between55To64', {
      type: 'DemographicStat',
    });
    t.field('above65', {
      type: 'DemographicStat',
    });
  },
});

export let IncomeDemographic = objectType({
  name: 'IncomeDemographic',
  definition(t) {
    t.field('under50KUsd', {
      type: 'DemographicStat',
    });
    t.field('between50to74KUsd', {
      type: 'DemographicStat',
    });
    t.field('between75to124KUsd', {
      type: 'DemographicStat',
    });
    t.field('between125to199KUsd', {
      type: 'DemographicStat',
    });
    t.field('above200KUsd', {
      type: 'DemographicStat',
    });
  },
});

export let EthnicityDemographic = objectType({
  name: 'EthnicityDemographic',
  definition(t) {
    t.field('white', {
      type: 'DemographicStat',
    });
    t.field('black', {
      type: 'DemographicStat',
    });
    t.field('indian', {
      type: 'DemographicStat',
    });
    t.field('asian', {
      type: 'DemographicStat',
    });
    t.field('pacificIslander', {
      type: 'DemographicStat',
    });
    t.field('other', {
      type: 'DemographicStat',
    });
  },
});

export let EducationDemographic = objectType({
  name: 'EducationDemographic',
  definition(t) {
    t.field('someHighschool', {
      type: 'DemographicStat',
    });
    t.field('highschool', {
      type: 'DemographicStat',
    });
    t.field('someCollege', {
      type: 'DemographicStat',
    });
    t.field('associate', {
      type: 'DemographicStat',
    });
    t.field('bachelor', {
      type: 'DemographicStat',
    });
    t.field('masters', {
      type: 'DemographicStat',
    });
    t.field('professional', {
      type: 'DemographicStat',
    });
    t.field('doctorate', {
      type: 'DemographicStat',
    });
  },
});

export let GenderDemographic = objectType({
  name: 'GenderDemographic',
  definition(t) {
    t.field('male', {
      type: 'DemographicStat',
    });
    t.field('female', {
      type: 'DemographicStat',
    });
  },
});

export let DemographicOverview = objectType({
  name: 'DemographicOverview',
  definition(t) {
    t.field('age', {
      type: 'AgeDemographic',
    });
    t.field('income', {
      type: 'IncomeDemographic',
    });
    t.field('ethnicity', {
      type: 'EthnicityDemographic',
    });
    t.field('education', {
      type: 'EducationDemographic',
    });
    t.field('gender', {
      type: 'GenderDemographic',
    });
  },
});

export let NearbyOverview = objectType({
  name: 'NearbyOverview',
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
      type: 'AffinitiesOverview',
    });
    t.field('keyFacts', {
      type: 'KeyFactsOverview',
    });
    t.field('commute', {
      type: 'CommuteOverview',
    });
    t.field('topPersonas', {
      type: 'PersonaOverview',
      list: true,
    });
    t.field('demographics1', {
      type: 'DemographicOverview',
    });
    t.field('demographics3', {
      type: 'DemographicOverview',
    });
    t.field('demographics5', {
      type: 'DemographicOverview',
    });
    t.field('nearby', {
      type: 'NearbyOverview',
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
