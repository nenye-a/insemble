import { inputObjectType } from 'nexus';

export let FilterInput = inputObjectType({
  name: 'FilterInput',
  definition(t) {
    t.int('minAge');
    t.int('maxAge');
    t.int('minIncome');
    t.int('maxIncome');
    t.int('minSize');
    t.int('maxSize');
    t.int('minFrontageWidth');
    t.int('maxFrontageWidth');
    t.string('personaIds', { list: true });
    t.string('equipmentIds', { list: true });
    t.string('spaceType', { list: true });
    t.string('categories', { list: true });
  },
});
