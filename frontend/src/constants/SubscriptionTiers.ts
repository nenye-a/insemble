import { TenantTier, LandlordTier } from '../generated/globalTypes';

export const LandlordTiers = {
  [LandlordTier.BASIC]: {
    id: 'prod_GlgyphMKy4y1RY',
    name: 'Basic',
    monthly: { id: 'plan_GlgzmsDFYNivMf', price: 30 },
    yearly: { id: 'plan_Glgzi3McWzuZ1v', price: 300 },
    title: '',
    benefits: [
      'Access thousands of pre-qualified tenants',
      'Complementary virtual tours & photos',
      'In depth marketing analytics',
    ],
    type: LandlordTier.BASIC,
  },
  [LandlordTier.PROFESSIONAL]: {
    id: 'prod_Glh0kj8K2C44rw',
    name: 'Professional',
    monthly: { id: 'plan_Glh0alOVw1hDJh', price: 450 },
    yearly: { id: 'plan_Glh0neF7FfBXcw', price: 4020 },
    title: 'Popular',
    benefits: [
      'See expanding tenants that fit property',
      'Advertise both on-market & off-market',
      'Full “Smart” access with no monthly fee',
      '24/7 support & premium services',
    ],
    type: LandlordTier.PROFESSIONAL,
  },
};

export const TenantTiers = {
  [TenantTier.FREE]: {
    id: 'free',
    name: 'Explore',
    monthly: { id: '', price: 0 },
    yearly: { id: '', price: 0 },
    title: '',
    benefits: [
      'Access matching locations and properties',
      'Connect with property managers & reps',
      'Compare prospective sites to existing stores',
      'See high level location match details',
    ],
    type: TenantTier.FREE,
  },
  [TenantTier.PROFESSIONAL]: {
    id: 'prod_GlgxaiFQlz2C0g',
    name: 'Professional',
    monthly: { id: 'plan_GlgyRHQ6XPof6v', price: 30 },
    yearly: { id: 'plan_GlgyE9w9q7ILhB', price: 300 },
    title: 'Popular with Experts',
    benefits: [
      'All “Explore” features',
      'See in-depth location match details',
      'See brand co-tenancies within each region',
      'See consumer personas that match your brand',
      '24hr support & premium services',
    ],
    type: TenantTier.PROFESSIONAL,
  },
};
