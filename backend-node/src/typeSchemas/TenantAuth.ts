import { objectType } from 'nexus';

export let TenantAuth = objectType({
  name: 'TenantAuth',
  definition(t) {
    t.string('token');
    t.field('tenant', {
      type: 'TenantUser',
    });
  },
});
