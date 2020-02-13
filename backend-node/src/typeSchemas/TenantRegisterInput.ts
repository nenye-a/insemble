import { inputObjectType } from 'nexus';

export let TenantRegisterInput = inputObjectType({
  name: 'TenantRegisterInput',
  definition(t) {
    t.string('email', { required: true });
    t.string('password', { required: true });
    t.string('firstName', { required: true });
    t.string('lastName', { required: true });
    t.string('company', { required: true });
  },
});
