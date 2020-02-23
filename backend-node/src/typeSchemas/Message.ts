import { objectType } from 'nexus';

export let Message = objectType({
  name: 'Message',
  definition(t) {
    t.string('message');
  },
});
