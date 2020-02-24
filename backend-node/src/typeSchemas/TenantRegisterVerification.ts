import { objectType } from 'nexus';

export let TenantVerification = objectType({
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
