import { rule, shield } from 'graphql-shield';

import { Context } from 'serverTypes';

let isAuthenticated = rule()(async (_, __, ctx: Context) => {
  return ctx.tenantUserId != null;
});

let permissions = shield({
  Query: {
    profileTenant: isAuthenticated,
  },
});

export { permissions };
