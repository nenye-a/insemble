import { objectType } from 'nexus';

export let TenantDetailsResult = objectType({
  name: 'TenantDetailsResult',
  definition(t) {
    t.string('name');
    t.string('category');
    t.field('tenantView', {
      type: 'TenantView',
    });
    t.field('insightView', {
      type: 'InsightView',
    });
    t.field('keyFacts', {
      type: 'TenantDetailKeyFacts',
    });
  },
});

export let TenantView = objectType({
  name: 'TenantView',
  definition(t) {
    t.string('overview');
    t.string('description');
    t.int('minSqft');
    t.int('maxSqft');
    t.int('ceilingHeight');
    t.string('condition');
  },
});

export let InsightView = objectType({
  name: 'InsightView',
  definition(t) {
    t.field('topPersonas', {
      type: 'PersonaDeepDive',
      list: true,
    });
    t.field('demographics1', {
      type: 'DemographicTenantDetail',
    });
    t.field('demographics3', {
      type: 'DemographicTenantDetail',
    });
    t.field('demographics5', {
      type: 'DemographicTenantDetail',
    });
  },
});

export let DemographicTenantDetailStat = objectType({
  name: 'DemographicTenantDetailStat',
  definition(t) {
    t.string('name');
    t.float('myLocation', { nullable: true });
    t.float('targetLocation');
  },
});

export let DemographicTenantDetail = objectType({
  name: 'DemographicTenantDetail',
  definition(t) {
    t.field('age', {
      type: 'DemographicTenantDetailStat',
      list: true,
    });
    t.field('income', {
      type: 'DemographicTenantDetailStat',
      list: true,
    });
    t.field('ethnicity', {
      type: 'DemographicTenantDetailStat',
      list: true,
    });
    t.field('education', {
      type: 'DemographicTenantDetailStat',
      list: true,
    });
    t.field('gender', {
      type: 'DemographicTenantDetailStat',
      list: true,
    });
  },
});
export let TenantDetailKeyFacts = objectType({
  name: 'TenantDetailKeyFacts',
  definition(t) {
    t.field('tenantPerformance', {
      type: 'TenantPerformance',
    });
  },
});

export let TenantPerformance = objectType({
  name: 'TenantPerformance',
  definition(t) {
    t.int('storeCount');
    t.int('averageReviews');
    t.int('operationYears');
    t.float('rating');
  },
});
