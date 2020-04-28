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
    properties: isLandlordAuthenticated,
    profileLandlord: isLandlordAuthenticated,
    profileTenant: isTenantAuthenticated,
    tenantMatches: isTenantAuthenticated,
    brands: isTenantAuthenticated,
    locationPreview: isTenantAuthenticated,
    locationDetails: isTenantAuthenticated,
    billingList: isTenantAuthenticated,
    paymentMethodList: isTenantAuthenticated,
    landlordSubscriptions: isLandlordAuthenticated,
    propertyMatches: isLandlordAuthenticated,
    propertyDetails: isLandlordAuthenticated,
    tenantDetail: isLandlordAuthenticated,
  },
  Mutation: {
    editProfileTenant: isTenantAuthenticated,
    createBrand: isTenantAuthenticated,
    deleteBrand: isTenantAuthenticated,
    editBrand: isTenantAuthenticated,
    createProperty: isLandlordAuthenticated,
    deleteProperty: isLandlordAuthenticated,
    editSpace: isLandlordAuthenticated,
    editProperty: isLandlordAuthenticated,
    createSpace: isLandlordAuthenticated,
    deleteSpace: isLandlordAuthenticated,
    createTenantSubscription: isTenantAuthenticated,
    editTenantSubscription: isTenantAuthenticated,
    cancelTenantSubscription: isTenantAuthenticated,
    createLandlordSubscription: isLandlordAuthenticated,
    createManyLandlordSubscription: isLandlordAuthenticated,
    editLandlordSubscription: isLandlordAuthenticated,
    editManyLandlordSubscription: isLandlordAuthenticated,
    cancelLandlordSubscription: isLandlordAuthenticated,
    undoCancelTenantSubscription: isTenantAuthenticated,
    undoCancelLandlordSubscription: isLandlordAuthenticated,
  },
});

export { permissions };
