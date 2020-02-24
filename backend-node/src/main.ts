import { GraphQLServer } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';

import { prisma } from './prisma';
import { schema } from '../src/schema';
import { authSession } from './helpers/auth';
import { permissions } from './middlewares/permission';
import { registerTenantHandler } from './controllers/registerTenantController';
import { emailVerificationTenantHandler } from './controllers/emailVerificationTenantController';

const server = new GraphQLServer({
  schema,
  context: async ({ request }: ContextParameters) => {
    let authorization = request.get('Authorization') || '';
    let token = authorization.replace(/^Bearer /, '');
    let authSessionResult = await authSession(token);
    return {
      prisma,
      ...authSessionResult,
    };
  },
  middlewares: [permissions],
});

server.express.use((req, res, next) => {
  res.setTimeout(500000, () => {
    // call back function is called when request timed out.
  });
  next();
});

server.express.get(
  '/register-tenant-verification/:token',
  registerTenantHandler,
);

server.express.get(
  '/email-tenant-verification/:token',
  emailVerificationTenantHandler,
);

server.start({}, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:4000`);
});
