import { inputObjectType } from 'nexus';

export let BrandInfoInput = inputObjectType({
  name: 'BrandInfoInput',
  definition(t) {
    t.string('brandName', { required: true });
    t.string('category', { required: true });
  },
});
