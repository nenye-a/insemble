import { objectType } from 'nexus';

export let LandlordRegisterResult = objectType({
  name: 'LandlordRegisterResult',
  definition(t) {
    t.string('message');
    t.string('verificationId');
  },
});
