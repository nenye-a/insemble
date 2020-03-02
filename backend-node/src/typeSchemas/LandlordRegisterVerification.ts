import { objectType } from 'nexus';

export let LandlordRegisterVerification = objectType({
  name: 'LandlordRegisterVerification',
  definition(t) {
    t.model.id();
    t.model.verified();
    t.field('landlordAuth', {
      type: 'LandlordAuth',
      nullable: true,
    });
  },
});
