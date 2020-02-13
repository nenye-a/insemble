import { Root, Context } from 'serverTypes';
import { mutationField, stringArg } from 'nexus';

let loginTenant = mutationField('loginTenant', {
  type: 'LoginTenant',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  resolve: loginTenantResolver,
});

async function loginTenantResolver(
  _: Root,
  { email, password }: { email: string; password: string },
  _context: Context,
) {
  return {
    tenant: {
      id: '1',
      email,
      firstName: 'Sams',
      lastName: 'Udin',
      company: 'Mock Fried Chicken',
      tier: 'Free',
      avatar: '',
    },
    token: 's3cr3t-t0ken_here',
  };
}

export { loginTenant };
