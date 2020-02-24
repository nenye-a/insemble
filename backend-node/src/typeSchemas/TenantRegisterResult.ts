import { objectType } from 'nexus';

export let TenantRegisterResult = objectType({
  name: 'TenantRegisterResult',
  definition(t) {
    t.string('message');
    t.string('verificationId');
  },
});
