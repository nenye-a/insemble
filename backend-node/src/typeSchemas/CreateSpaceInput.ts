import { inputObjectType } from 'nexus';

export let CreateSpaceInput = inputObjectType({
  name: 'CreateSpaceInput',
  definition(t) {
    t.field('mainPhoto', { type: 'Upload', required: true });
    t.field('photoUploads', { type: 'Upload', list: true });
    t.string('photoUrls', { list: true });
    t.string('description', { required: true });
    t.string('condition', { required: true });
    t.int('sqft', { required: true });
    t.int('pricePerSqft', { required: true });
    t.string('equipment', { list: true });
    t.field('available', { type: 'DateTime', required: true });
  },
});
