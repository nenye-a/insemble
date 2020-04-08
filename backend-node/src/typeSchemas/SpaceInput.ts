import { inputObjectType } from 'nexus';

export let SpaceInput = inputObjectType({
  name: 'SpaceInput',
  definition(t) {
    t.field('mainPhoto', { type: 'Upload' });
    t.string('mainPhotoUrl');
    t.field('photoUploads', { type: 'Upload', list: true });
    t.string('photoUrls', { list: true });
    t.string('description', { required: true });
    t.string('condition', { required: true });
    t.int('sqft', { required: true });
    t.int('pricePerSqft', { required: true });
    t.string('equipment', { list: true });
    t.field('available', { type: 'DateTime', required: true });
    t.string('spaceType', { list: true });
    t.field('marketingPreference', {
      type: 'MarketingPreference',
      required: true,
    }); //enum
  },
});
