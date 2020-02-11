import { Root, Context } from 'serverTypes';

async function loginTenant(
    _: Root,
    { email, password }: { email: string; password: string },
    _context: Context,
) {
    if (password) {
        return {
            tenant: {
                id: '1',
                email,
                firstName: 'Sams',
                lastName: 'Udin',
                company: 'Mock Fried Chicken',
                tier: 'Free',
                role: 'Tenant',
                avatar: '',
            },
            token: 's3cr3t-t0ken_here',
        };
    }
    return null;
}

export { loginTenant };
