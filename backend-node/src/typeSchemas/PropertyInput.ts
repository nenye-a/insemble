import { inputObjectType } from 'nexus';

export let PropertyInput = inputObjectType({
  name: 'PropertyInput',
  definition(t) {
    t.string('name', { required: true });
    t.field('location', { type: 'LocationInput', required: true });
    t.string('userRelations', { required: true, list: true });
    t.string('propertyType', { list: true });
    t.field('marketingPreference', {
      type: 'MarketingPreference',
      required: true,
    }); //enum
    t.string('categories', { list: true });
    t.string('exclusive', { list: true });
    t.string('businessType', { list: true });
  },
});
