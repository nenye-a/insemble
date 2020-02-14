import { mutationField, arg } from 'nexus';
import { Context } from 'serverTypes';

export let registerTenant = mutationField('registerTenant', {
  type: 'TenantAuth',
  args: {
    tenant: arg({ type: 'TenantRegisterInput', required: true }),
  },
  resolve: (_, {}, context: Context) => {
    return {
      token: 'put token here',
      tenant: {
        id: '1',
        email: 'mockemail@mock.com',
        firstName: 'firstname',
        lastName: 'lastname',
        avatar: '',
        company: 'mock company',
        tier: 'FREE',
      },
    };
  },
});
