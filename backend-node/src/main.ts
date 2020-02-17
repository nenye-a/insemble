import { GraphQLServer } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';

import { prisma } from './prisma';
import { schema } from '../src/schema';
import { authTenantSession } from './helpers/auth';

const server = new GraphQLServer({
  schema,
  context: async ({ request }: ContextParameters) => {
    let authorization = request.get('Authorization') || '';
    let token = authorization.replace(/^Bearer /, '');
    let tenantUserId = await authTenantSession(token);
    if (tenantUserId) {
      return {
        prisma,
        tenantUserId,
      };
    }
    return {
      prisma,
    };
  },
});

server.start(() => {
  console.log(`Server is running on http://localhost:4000`);
});
