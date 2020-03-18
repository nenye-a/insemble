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
    t.int('minAge');
    t.int('maxAge');
    t.int('minDaytimePopulation');
    t.string('personas', { list: true });
    t.string('equipment', { list: true });
    t.string('ethnicity', { list: true });
    t.string('spaceType', { list: true });
    t.string('commute', { list: true });
    t.string('education', { list: true });
    t.string('categories', { list: true });
  },
});
