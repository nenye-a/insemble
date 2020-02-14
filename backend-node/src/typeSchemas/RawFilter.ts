import { objectType } from 'nexus';

export let RawFilter = objectType({
  name: 'RawFilter',
  definition(t) {
    t.string('rawValue');
    t.string('displayValue');
  },
});
