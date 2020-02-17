import { objectType } from 'nexus';

export let Location = objectType({
  name: 'Location',
  definition(t) {
    t.model.id();
    t.model.address();
    t.model.lng();
    t.model.lat();
  },
});
