import { Root, Context } from 'serverTypes';

async function registerTenant(_: Root, __: any, ___: Context) {
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
}

export { registerTenant };
