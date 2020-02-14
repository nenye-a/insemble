import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './prisma';
import { schema } from '../src/schema';
import { Context } from 'serverTypes';

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
