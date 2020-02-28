import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

const mockPropertyMatches = {
  brandId: 'test mock id',
  name: 'Burger King',
  pictureUrl: '',
  category: 'Fast food',
  numExistingLocations: 3,
  matchValue: 92,
  interested: true,
  verified: false,
  claimed: false,
  matchesTenantType: false,
  exclusivityRisk: false,
};

const mockPropertyMatches2 = {
  brandId: 'test mock id2',
  name: 'Mc Donald',
  pictureUrl: '',
  category: 'Fast food',
  numExistingLocations: 20,
  matchValue: 89,
  interested: false,
  verified: false,
  claimed: false,
  matchesTenantType: false,
  exclusivityRisk: false,
};

const mockPropertyMatches3 = {
  brandId: 'test mock id3',
  name: 'KFC',
  pictureUrl: '',
  category: 'Fast food',
  numExistingLocations: 90,
  matchValue: 89,
  interested: false,
  verified: false,
  claimed: false,
  matchesTenantType: false,
  exclusivityRisk: false,
};

let propertyMatchesResolver: FieldResolver<'Query', 'propertyMatches'> = async (
  _: Root,
  _args,
  _context: Context,
) => {
  return [mockPropertyMatches, mockPropertyMatches2,mockPropertyMatches3];
};

let propertyMatches = queryField('propertyMatches', {
  type: 'PropertyMatchesThumbnail',
  args: {
    propertyId: stringArg({ required: true }),
  },
  resolve: propertyMatchesResolver,
  list: true,
});

export { propertyMatches };
