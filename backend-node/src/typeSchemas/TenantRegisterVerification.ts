import { objectType } from 'nexus';

export let TenantRegisterVerification = objectType({
  name: 'TenantRegisterVerification',
  definition(t) {
    t.model.id();
    t.model.verified();
    t.field('tenantAuth', {
      type: 'TenantAuth',
      nullable: true,
    });
  },
});
