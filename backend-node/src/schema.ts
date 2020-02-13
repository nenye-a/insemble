import { queryType, stringArg, makeSchema } from 'nexus';

let Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (_, { name }) => `Hello ${name || 'World'}!`,
    });
  },
});

let schema = makeSchema({
  types: [Query],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/typings.ts',
  },
});

export { schema };
