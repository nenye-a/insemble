import { GraphQLServer } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';

import { schema } from '../src/schema';
import { Context } from 'serverTypes';

export const prisma = new PrismaClient();

const server = new GraphQLServer({
  schema,
  context: (): Context => {
    return {
      prisma,
    };
  },
});

server.start(() => {
  console.log(`Server is running on http://localhost:4000`);
});
