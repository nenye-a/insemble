import { categories } from './category/categoryQuery';
import { lmatches, tmatches } from './matches/matchesQuery';
import { search } from './search/searchQuery';
import { registerTenant } from './auth/registerTenantMutation';
import { loginTenant } from './auth/loginMutation';

export default {
  Query: {
    categories,
    lmatches,
    tmatches,
    search,
  },
  Mutation: {
    registerTenant,
    loginTenant,
  },
};
