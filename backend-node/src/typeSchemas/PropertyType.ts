import { objectType } from 'nexus';

export let Property = objectType({
  name: 'Property',
  definition(t) {
    t.model.id();
    t.model.businessType();
    t.model.categories();
    t.model.exclusive();
    t.model.location();
    t.model.marketingPreference();
    t.model.propertyType();
    t.model.name();
    t.model.userRelation();
    t.model.space();
  },
});
