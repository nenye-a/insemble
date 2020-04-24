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
      nullable: true,
    });
    t.field('topPersonas', {
      type: 'PersonaDeepDive',
      list: true,
      nullable: true,
    });
    t.field('demographics1', {
      type: 'DemographicProperty',
      nullable: true,
    });
    t.field('demographics3', {
      type: 'DemographicProperty',
      nullable: true,
    });
    t.field('demographics5', {
      type: 'DemographicProperty',
      nullable: true,
    });
  },
});
