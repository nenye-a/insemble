import { objectType } from 'nexus';

export let LoginTenant = objectType({
  name: 'LoginTenant',
  definition: (t) => {
    t.string('token');
    t.field('tenant', { type: 'User' });
  },
});

export let User = objectType({
  name: 'User',
  definition: (t) => {
    t.string('id');
    t.string('email');
    t.string('firstName');
    t.string('lastName');
    t.string('avatar');
    t.string('company');
    t.string('tier');
  },
});
