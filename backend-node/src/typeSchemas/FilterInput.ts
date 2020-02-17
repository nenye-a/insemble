import { inputObjectType } from 'nexus';

export let FilterInput = inputObjectType({
  name: 'FilterInput',
  definition(t) {
    t.int('minIncome');
    t.int('maxIncome');
    t.int('minRent');
    t.int('maxRent');
    t.int('minSize');
    t.int('maxSize');
    t.int('minFrontageWidth');
    t.int('maxFrontageWidth');
    t.int('minAge');
    t.int('maxAge');
    t.string('personas', { list: true });
    t.string('equipmentIds', { list: true });
    t.string('spaceType', { list: true });
    t.string('commute', { list: true });
    t.string('education', { list: true });
    t.string('categories', { list: true });
  },
});
