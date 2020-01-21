import { GraphQLServer } from 'graphql-yoga';
import resolvers from './resolvers';
import { prisma } from './generated/prisma-client/';

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        prisma,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

// eslint-disable-next-line no-console
server.start(() => console.log('Server is running on http://localhost:4000'));
