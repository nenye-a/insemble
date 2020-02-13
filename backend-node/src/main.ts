import { GraphQLServer } from 'graphql-yoga';
import { schema } from '../src/schema';

const server = new GraphQLServer({
  schema,
});

server.start(() => {
  console.log(`Server is running on http://localhost:4000`);
});
