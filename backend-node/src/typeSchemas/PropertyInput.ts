import { inputObjectType } from 'nexus';

export let PropertyInput = inputObjectType({
  name: 'PropertyInput',
  definition(t) {
    t.string('name', { required: true });
    t.field('location', { type: 'LocationInput', required: true });
    t.string('userRelations', { required: true, list: true });
    t.string('exclusive', { list: true });
    t.string('businessType', { list: true });
  },
});
