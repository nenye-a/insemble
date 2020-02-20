import { objectType } from 'nexus';

export let Landlord = objectType({
  name: 'LandlordUser',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.firstName();
    t.model.lastName();
    t.model.avatar();
    t.model.company();
    t.model.description();
    t.model.title();
    t.model.tier();
  },
});
