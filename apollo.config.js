module.exports = {
  client: {
    service: {
      name: 'insemble',
      url: 'http://localhost:4000/graphql',
      includes: ['.frontend/src/graphql/queries/**/*.ts'],
    },
  },
};
