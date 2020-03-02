import { objectType } from 'nexus';

export let PropertyDetailsResult = objectType({
  name: 'PropertyDetailsResult',
  definition(t) {
    t.field('keyFacts', {
      type: 'KeyFactsDeepDive',
    });
    t.field('commute', {
      type: 'CommuteDeepDive',
      list: true,
    });
    t.field('topPersonas', {
      type: 'PersonaDeepDive',
      list: true,
    });
    t.field('demographics1', {
      type: 'DemographicProperty',
    });
    t.field('demographics3', {
      type: 'DemographicProperty',
    });
    t.field('demographics5', {
      type: 'DemographicProperty',
    });
  },
});
