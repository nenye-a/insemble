import { inputObjectType } from 'nexus';

export let LocationInput = inputObjectType({
  name: 'LocationInput',
  definition(t) {
    t.string('name');
    t.string('lat');
    t.string('lng');
  },
});
