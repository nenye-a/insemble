import { objectType } from 'nexus';

export let LandlordAuth = objectType({
  name: 'LandlordAuth',
  definition(t) {
    t.string('token');
    t.field('landlord', {
      type: 'LandlordUser',
    });
    t.string('brandId');
  },
});
