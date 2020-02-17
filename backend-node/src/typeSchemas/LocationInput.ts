import { inputObjectType } from 'nexus';

export let LocationInput = inputObjectType({
  name: 'LocationInput',
  definition(t) {
    t.string('address', { required: true });
    t.string('lat', { required: true });
    t.string('lng', { required: true });
  },
});
