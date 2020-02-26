import { rule, shield } from 'graphql-shield';

import { Context } from 'serverTypes';

let isTenantAuthenticated = rule()(async (_, __, ctx: Context) => {
  return ctx.tenantUserId != null;
});

let isLandlordAuthenticated = rule()(async (_, __, ctx: Context) => {
  return ctx.landlordUserId != null;
});

let permissions = shield({
  Query: {
    profileLandlord: isLandlordAuthenticated,
    profileTenant: isTenantAuthenticated,
    tenantMatches: isTenantAuthenticated,
    brands: isTenantAuthenticated,
    locationPreview: isTenantAuthenticated,
    locationDetails: isTenantAuthenticated,
  },
  Mutation: {
    editProfileTenant: isTenantAuthenticated,
    createBrand: isTenantAuthenticated,
    editBrand: isTenantAuthenticated,
  },
});

export { permissions };
