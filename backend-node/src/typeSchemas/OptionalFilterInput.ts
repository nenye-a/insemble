import { inputObjectType } from 'nexus';

export let OptionalFilterInput = inputObjectType({
  name: 'OptionalFilterInput',
  definition(t) {
    t.int('minAge');
    t.int('maxAge');
    t.int('minSize');
    t.int('maxSize');
    t.int('minFrontageWidth');
    t.int('maxFrontageWidth');
    t.int('minRent');
    t.int('maxRent');
    t.string('education', { list: true });
    t.string('commute', { list: true });
    t.string('personas', { list: true });
    t.string('equipmentIds', { list: true });
    t.string('spaceType', { list: true });
  },
});
