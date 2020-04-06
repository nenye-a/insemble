import { objectType } from 'nexus';

export let Property = objectType({
  name: 'Property',
  definition(t) {
    t.model.id();
    t.model.businessType();
    t.model.propertyId();
    t.model.exclusive();
    t.model.location();
    t.model.name();
    t.model.userRelations();
    t.model.space();
  },
});
