import { inputObjectType } from 'nexus';

export let SpaceInput = inputObjectType({
  name: 'SpaceInput',
  definition(t) {
    t.string('mainPhoto', { required: true });
    t.string('photos', { list: true });
    t.string('description', { required: true });
    t.string('condition', { required: true });
    t.int('sqft', { required: true });
    t.int('pricePerSqft', { required: true });
    t.string('equipment', { list: true });
    t.string('available', { required: true });
  },
});
